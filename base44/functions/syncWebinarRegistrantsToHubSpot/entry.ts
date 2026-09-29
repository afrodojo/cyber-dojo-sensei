import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { registrant_email, registrant_name, webinar_title, webinar_date } = await req.json();

    if (!registrant_email || !registrant_name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get HubSpot access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('hubspot');

    // Create or update contact in HubSpot
    const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          firstname: registrant_name.split(' ')[0],
          lastname: registrant_name.split(' ').slice(1).join(' ') || '',
          email: registrant_email,
          hs_lead_status: 'OPEN',
          lifecyclestage: 'subscriber'
        }
      })
    });

    if (!contactResponse.ok) {
      const error = await contactResponse.json();
      // Check if contact already exists
      if (error.message && error.message.includes('already exists')) {
        return Response.json({ 
          success: true, 
          message: 'Contact already exists in HubSpot',
          action: 'contact_exists'
        });
      }
    }

    const contactData = await contactResponse.json();
    
    return Response.json({
      success: true,
      message: 'Registrant synced to HubSpot',
      contactId: contactData.id || contactData.vid,
      webinar: webinar_title,
      date: webinar_date
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});