import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const dealStageMap = {
  'red-team': 'negotiation',
  'penetration-testing': 'negotiation',
  'security-consulting': 'negotiation',
  'training': 'negotiation',
  'speaking': 'negotiation',
  'other': 'qualification'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('hubspot');

    const body = await req.json();
    const { name, email, company, title, phone, message, service_interest } = body;

    // Create contact in HubSpot
    const contactRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          firstname: name.split(' ')[0] || name,
          lastname: name.split(' ').slice(1).join(' ') || '',
          email: email,
          phone: phone || '',
          company: company || '',
          jobtitle: title || ''
        }
      })
    });

    if (!contactRes.ok) {
      const error = await contactRes.json();
      return Response.json({ error: 'Failed to create contact', details: error }, { status: 400 });
    }

    const contact = await contactRes.json();
    const contactId = contact.id;

    // Create deal in HubSpot
    const dealRes = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          dealname: `${name} - ${service_interest.replace('-', ' ')}`,
          dealstage: dealStageMap[service_interest] || 'qualification',
          description: message,
          associated_contacts: [contactId]
        }
      })
    });

    if (!dealRes.ok) {
      const error = await dealRes.json();
      return Response.json({ error: 'Failed to create deal', details: error }, { status: 400 });
    }

    const deal = await dealRes.json();

    return Response.json({
      success: true,
      contactId: contact.id,
      dealId: deal.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});