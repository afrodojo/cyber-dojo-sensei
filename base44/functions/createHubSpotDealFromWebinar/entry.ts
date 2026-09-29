import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      contact_email,
      contact_name,
      deal_name,
      service_interest,
      webinar_title,
      deal_amount,
      deal_stage = 'qualification'
    } = await req.json();

    if (!contact_email || !deal_name || !service_interest) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get HubSpot access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('hubspot');

    // First, ensure contact exists or create it
    const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          firstname: contact_name.split(' ')[0],
          lastname: contact_name.split(' ').slice(1).join(' ') || '',
          email: contact_email,
          hs_lead_status: 'OPEN',
          lifecyclestage: 'subscriber'
        }
      })
    });

    let contactId;
    if (contactResponse.ok) {
      const contactData = await contactResponse.json();
      contactId = contactData.id;
    } else {
      const error = await contactResponse.json();
      if (error.message && error.message.includes('already exists')) {
        // Get contact ID by searching
        const searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
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
                    value: contact_email
                  }
                ]
              }
            ],
            limit: 1
          })
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          contactId = searchData.results[0]?.id || null;
        }
      }
    }

    // Create deal in HubSpot
    const dealPayload = {
      properties: {
        dealname: deal_name,
        dealstage: deal_stage,
        pipeline: 'default',
        hs_analytics_num_page_views: 0,
        description: `Service Interest: ${service_interest}\nWebinar: ${webinar_title}`
      }
    };

    if (deal_amount) {
      dealPayload.properties.amount = deal_amount;
    }

    const dealResponse = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dealPayload)
    });

    if (!dealResponse.ok) {
      throw new Error('Failed to create deal in HubSpot');
    }

    const dealData = await dealResponse.json();

    // Associate contact with deal if contact ID exists
    if (contactId) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealData.id}/associations/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          associationCategory: 'HUBSPOT_DEFINED',
          associationType: 'deal_contact'
        })
      });
    }

    return Response.json({
      success: true,
      message: 'Deal created in HubSpot',
      dealId: dealData.id,
      dealName: deal_name,
      serviceInterest: service_interest,
      webinar: webinar_title
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});