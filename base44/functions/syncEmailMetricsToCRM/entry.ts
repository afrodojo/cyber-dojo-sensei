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
    const { emailFollowUpId, crmSystem } = body;

    if (!emailFollowUpId || !crmSystem) {
      return Response.json({ error: 'Missing emailFollowUpId or crmSystem' }, { status: 400 });
    }

    // Fetch email follow-up record
    const emailFollowUp = await base44.asServiceRole.entities.EmailFollowUp.get(emailFollowUpId);
    if (!emailFollowUp) {
      return Response.json({ error: 'EmailFollowUp not found' }, { status: 404 });
    }

    // Get CRM access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken(crmSystem);

    // Mock email metrics (in production, would come from email service)
    const metrics = {
      email_sent: emailFollowUp.sent_at ? true : false,
      email_opened: Math.random() > 0.5,
      email_clicked: Math.random() > 0.7,
      email_replied: Math.random() > 0.8,
      open_count: Math.floor(Math.random() * 5),
      click_count: Math.floor(Math.random() * 3),
      last_opened: new Date().toISOString()
    };

    let syncResult;
    
    if (crmSystem === 'hubspot') {
      syncResult = await syncToHubSpot(accessToken, emailFollowUp, metrics, base44);
    } else if (crmSystem === 'salesforce') {
      syncResult = await syncToSalesforce(accessToken, emailFollowUp, metrics, base44);
    }

    // Log the sync
    const duration = Date.now() - startTime;
    await base44.asServiceRole.entities.CRMSyncLog.create({
      crm_system: crmSystem,
      sync_type: 'email_metrics',
      entity_type: 'EmailFollowUp',
      entity_id: emailFollowUpId,
      crm_record_id: syncResult.crm_record_id,
      status: syncResult.success ? 'success' : 'error',
      message: syncResult.message,
      data_synced: JSON.stringify(metrics),
      error_details: syncResult.error || null,
      duration_ms: duration
    });

    return Response.json({ success: true, ...syncResult });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Email metrics sync error:', error);
    return Response.json({
      success: false,
      error: error.message,
      duration_ms: duration
    }, { status: 500 });
  }
});

async function syncToHubSpot(accessToken, emailFollowUp, metrics, base44) {
  try {
    const leadEmail = emailFollowUp.recipient_email;
    
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
                  value: leadEmail
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

    // Update contact with email metrics
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
            email_opened: metrics.email_opened,
            email_clicked: metrics.email_clicked,
            email_replied: metrics.email_replied,
            hs_analytics_num_page_views: metrics.open_count,
            notes: `Email follow-up sent. Opens: ${metrics.open_count}, Clicks: ${metrics.click_count}`
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
      message: 'Successfully synced email metrics to HubSpot',
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

async function syncToSalesforce(accessToken, emailFollowUp, metrics, base44) {
  try {
    const leadEmail = emailFollowUp.recipient_email;

    // Query for Lead by email
    const query = `SELECT Id FROM Lead WHERE Email = '${leadEmail}' LIMIT 1`;
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
        message: 'Failed to search Salesforce Lead',
        error: JSON.stringify(error)
      };
    }

    const searchData = await searchRes.json();
    const records = searchData.records || [];

    if (records.length === 0) {
      return {
        success: false,
        message: 'Lead not found in Salesforce',
        error: 'No matching lead'
      };
    }

    const leadId = records[0].Id;

    // Update Lead with email metrics
    const updateRes = await fetch(
      `https://your-instance.salesforce.com/services/data/v57.0/sobjects/Lead/${leadId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Email_Opened__c: metrics.email_opened,
          Email_Clicked__c: metrics.email_clicked,
          Email_Replied__c: metrics.email_replied,
          Email_Open_Count__c: metrics.open_count,
          Email_Click_Count__c: metrics.click_count,
          Description: `Email follow-up sent. Opens: ${metrics.open_count}, Clicks: ${metrics.click_count}`
        })
      }
    );

    if (!updateRes.ok) {
      const error = await updateRes.json();
      return {
        success: false,
        message: 'Failed to update Salesforce Lead',
        error: JSON.stringify(error),
        crm_record_id: leadId
      };
    }

    return {
      success: true,
      message: 'Successfully synced email metrics to Salesforce',
      crm_record_id: leadId
    };
  } catch (error) {
    return {
      success: false,
      message: 'Salesforce sync error',
      error: error.message
    };
  }
}