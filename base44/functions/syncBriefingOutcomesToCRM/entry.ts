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
    const { executiveBriefingId, crmSystem, outcome } = body;

    if (!executiveBriefingId || !crmSystem || !outcome) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch executive briefing record
    const briefing = await base44.asServiceRole.entities.ExecutiveBriefing.get(executiveBriefingId);
    if (!briefing) {
      return Response.json({ error: 'ExecutiveBriefing not found' }, { status: 404 });
    }

    // Get CRM access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken(crmSystem);

    // Map outcome to deal stage
    const dealStageMap = {
      'qualified': 'Qualified',
      'next_steps_defined': 'Negotiation',
      'proposal_pending': 'Proposal',
      'won': 'Closed Won',
      'lost': 'Closed Lost'
    };

    const syncData = {
      briefing_outcome: outcome,
      briefing_date: briefing.scheduled_datetime,
      contact_name: briefing.name,
      contact_company: briefing.company,
      status: outcome
    };

    let syncResult;

    if (crmSystem === 'hubspot') {
      syncResult = await syncToHubSpot(accessToken, briefing, syncData, dealStageMap);
    } else if (crmSystem === 'salesforce') {
      syncResult = await syncToSalesforce(accessToken, briefing, syncData, dealStageMap);
    }

    // Log the sync
    const duration = Date.now() - startTime;
    await base44.asServiceRole.entities.CRMSyncLog.create({
      crm_system: crmSystem,
      sync_type: 'briefing_outcome',
      entity_type: 'ExecutiveBriefing',
      entity_id: executiveBriefingId,
      crm_record_id: syncResult.crm_record_id,
      status: syncResult.success ? 'success' : 'error',
      message: syncResult.message,
      data_synced: JSON.stringify(syncData),
      error_details: syncResult.error || null,
      duration_ms: duration
    });

    return Response.json({ success: true, ...syncResult });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Briefing outcome sync error:', error);
    return Response.json({
      success: false,
      error: error.message,
      duration_ms: duration
    }, { status: 500 });
  }
});

async function syncToHubSpot(accessToken, briefing, syncData, dealStageMap) {
  try {
    const briefingEmail = briefing.email;

    // Search for contact by email
    const searchRes = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: briefingEmail
                }
              ]
            }
          ],
          limit: 1
        })
      }
    );

    if (!searchRes.ok) {
      const error = await searchRes.json();
      return {
        success: false,
        message: 'Failed to search HubSpot contact',
        error: JSON.stringify(error)
      };
    }

    const searchData = await searchRes.json();
    const contacts = searchData.results || [];

    if (contacts.length === 0) {
      return {
        success: false,
        message: 'Contact not found in HubSpot',
        error: 'No matching contact'
      };
    }

    const contactId = contacts[0].id;

    // Update contact with briefing outcome
    const updateRes = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            lifecyclestage: syncData.status === 'qualified' ? 'marketingqualifiedlead' : 'lead',
            hs_pipeline_stage: dealStageMap[syncData.status] || 'lead',
            notes: `Executive Briefing completed. Outcome: ${syncData.status}`
          }
        })
      }
    );

    if (!updateRes.ok) {
      const error = await updateRes.json();
      return {
        success: false,
        message: 'Failed to update HubSpot contact',
        error: JSON.stringify(error),
        crm_record_id: contactId
      };
    }

    return {
      success: true,
      message: 'Successfully synced briefing outcome to HubSpot',
      crm_record_id: contactId
    };
  } catch (error) {
    return {
      success: false,
      message: 'HubSpot sync error',
      error: error.message
    };
  }
}

async function syncToSalesforce(accessToken, briefing, syncData, dealStageMap) {
  try {
    const briefingEmail = briefing.email;

    // Query for Contact or Lead by email
    const query = `SELECT Id FROM Contact WHERE Email = '${briefingEmail}' LIMIT 1`;
    const encodedQuery = encodeURIComponent(query);

    const searchRes = await fetch(
      `https://your-instance.salesforce.com/services/data/v57.0/query?q=${encodedQuery}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!searchRes.ok) {
      const error = await searchRes.json();
      return {
        success: false,
        message: 'Failed to search Salesforce Contact',
        error: JSON.stringify(error)
      };
    }

    const searchData = await searchRes.json();
    const records = searchData.records || [];

    if (records.length === 0) {
      return {
        success: false,
        message: 'Contact not found in Salesforce',
        error: 'No matching contact'
      };
    }

    const contactId = records[0].Id;

    // Update Contact with briefing outcome
    const updateRes = await fetch(
      `https://your-instance.salesforce.com/services/data/v57.0/sobjects/Contact/${contactId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Briefing_Outcome__c: syncData.status,
          Briefing_Date__c: syncData.briefing_date,
          Lead_Status__c: syncData.status === 'qualified' ? 'Qualified' : 'Open',
          Description: `Executive Briefing completed. Outcome: ${syncData.status}`
        })
      }
    );

    if (!updateRes.ok) {
      const error = await updateRes.json();
      return {
        success: false,
        message: 'Failed to update Salesforce Contact',
        error: JSON.stringify(error),
        crm_record_id: contactId
      };
    }

    return {
      success: true,
      message: 'Successfully synced briefing outcome to Salesforce',
      crm_record_id: contactId
    };
  } catch (error) {
    return {
      success: false,
      message: 'Salesforce sync error',
      error: error.message
    };
  }
}