import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const startTime = Date.now();
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { crmSystem } = body;

    if (!crmSystem) {
      return Response.json({ error: 'Missing crmSystem' }, { status: 400 });
    }

    // Check if CRM is connected
    const crmConfigs = await base44.asServiceRole.entities.CRMConfig.filter({ crm_system: crmSystem });
    if (!crmConfigs.length || !crmConfigs[0].is_connected) {
      return Response.json({
        success: false,
        message: `${crmSystem} is not connected`,
        imported: 0
      });
    }

    const accessToken = await base44.asServiceRole.connectors.getAccessToken(crmSystem);

    let importedLeads = 0;
    let errors = [];

    if (crmSystem === 'hubspot') {
      const result = await syncFromHubSpot(accessToken, base44);
      importedLeads = result.imported;
      errors = result.errors;
    } else if (crmSystem === 'salesforce') {
      const result = await syncFromSalesforce(accessToken, base44);
      importedLeads = result.imported;
      errors = result.errors;
    }

    // Update last sync time
    await base44.asServiceRole.entities.CRMConfig.update(crmConfigs[0].id, {
      last_sync: new Date().toISOString()
    });

    const duration = Date.now() - startTime;

    // Log the sync
    await base44.asServiceRole.entities.CRMSyncLog.create({
      crm_system: crmSystem,
      sync_type: 'lead_sync',
      entity_type: 'Lead',
      status: errors.length === 0 ? 'success' : 'partial',
      message: `Imported ${importedLeads} leads from ${crmSystem}`,
      error_details: errors.length > 0 ? JSON.stringify(errors) : null,
      duration_ms: duration
    });

    return Response.json({
      success: true,
      imported: importedLeads,
      errors: errors.length > 0 ? errors : undefined,
      duration_ms: duration
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('CRM sync error:', error);
    return Response.json({
      success: false,
      error: error.message,
      duration_ms: duration
    }, { status: 500 });
  }
});

async function syncFromHubSpot(accessToken, base44) {
  const imported = [];
  const errors = [];

  try {
    // Fetch contacts from HubSpot
    const res = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,company,jobtitle,lifecyclestage',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!res.ok) {
      const error = await res.json();
      errors.push(`Failed to fetch HubSpot contacts: ${JSON.stringify(error)}`);
      return { imported: 0, errors };
    }

    const data = await res.json();
    const contacts = data.results || [];

    for (const contact of contacts) {
      try {
        const props = contact.properties || {};
        
        // Check if lead already exists
        const existingLeads = await base44.asServiceRole.entities.Lead.filter({
          email: props.email?.value
        });

        const leadData = {
          name: `${props.firstname?.value || ''} ${props.lastname?.value || ''}`.trim() || props.email?.value,
          email: props.email?.value,
          company: props.company?.value,
          title: props.jobtitle?.value,
          phone: props.phone?.value,
          status: props.lifecyclestage?.value === 'marketingqualifiedlead' ? 'qualified' : 'new',
          message: `Imported from HubSpot on ${new Date().toLocaleDateString()}`
        };

        if (existingLeads.length === 0) {
          // Create new lead
          await base44.asServiceRole.entities.Lead.create(leadData);
          imported.push(props.email?.value);
        }
      } catch (error) {
        errors.push(`Failed to import contact ${contact.id}: ${error.message}`);
      }
    }
  } catch (error) {
    errors.push(`HubSpot sync error: ${error.message}`);
  }

  return { imported: imported.length, errors };
}

async function syncFromSalesforce(accessToken, base44) {
  const imported = [];
  const errors = [];

  try {
    // Query Leads from Salesforce
    const query = "SELECT Id, FirstName, LastName, Email, Phone, Company, Title FROM Lead LIMIT 100";
    const encodedQuery = encodeURIComponent(query);

    const res = await fetch(
      `https://your-instance.salesforce.com/services/data/v57.0/query?q=${encodedQuery}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!res.ok) {
      const error = await res.json();
      errors.push(`Failed to fetch Salesforce leads: ${JSON.stringify(error)}`);
      return { imported: 0, errors };
    }

    const data = await res.json();
    const records = data.records || [];

    for (const record of records) {
      try {
        // Check if lead already exists
        const existingLeads = await base44.asServiceRole.entities.Lead.filter({
          email: record.Email
        });

        const leadData = {
          name: `${record.FirstName || ''} ${record.LastName || ''}`.trim() || record.Email,
          email: record.Email,
          company: record.Company,
          title: record.Title,
          phone: record.Phone,
          status: 'new',
          message: `Imported from Salesforce on ${new Date().toLocaleDateString()}`
        };

        if (existingLeads.length === 0) {
          // Create new lead
          await base44.asServiceRole.entities.Lead.create(leadData);
          imported.push(record.Email);
        }
      } catch (error) {
        errors.push(`Failed to import lead ${record.Id}: ${error.message}`);
      }
    }
  } catch (error) {
    errors.push(`Salesforce sync error: ${error.message}`);
  }

  return { imported: imported.length, errors };
}