import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Validate input
    const { name, email, organization, inquiry_type, message } = await req.json();
    
    if (!name || !email || !inquiry_type || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Basic rate limiting: check if same email submitted in last 5 minutes
    const recentSubmissions = await base44.asServiceRole.entities.Lead.filter(
      { email: email },
      '-created_date',
      1
    );
    
    if (recentSubmissions.length > 0) {
      const lastSubmission = new Date(recentSubmissions[0].created_date);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (lastSubmission > fiveMinutesAgo) {
        return Response.json(
          { error: 'Please wait before submitting again' },
          { status: 429 }
        );
      }
    }

  // 1. Save to Lead entity
  await base44.asServiceRole.entities.Lead.create({
    name,
    email,
    company: organization || "",
    message: `[Sentinel Research - ${inquiry_type}] ${message}`,
    service_interest: "other",
    status: "new"
  });

  // 2. Create/update HubSpot contact
  const { accessToken } = await base44.asServiceRole.connectors.getConnection("hubspot");

  // Search for existing contact
  const searchRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }] })
  });
  const searchData = await searchRes.json();

  let contactId;
  if (searchData.results && searchData.results.length > 0) {
    contactId = searchData.results[0].id;
  } else {
    const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        properties: {
          email,
          firstname: name.split(" ")[0],
          lastname: name.split(" ").slice(1).join(" ") || "",
          company: organization || ""
        }
      })
    });
    const contactData = await createRes.json();
    contactId = contactData.id;
  }

  // 3. Create HubSpot deal
  const dealRes = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: {
        dealname: `Sentinel Research - ${inquiry_type} - ${name}`,
        pipeline: "default",
        dealstage: "appointmentscheduled",
        description: message,
        hs_deal_stage_probability: "0.2"
      }
    })
  });
  const dealData = await dealRes.json();

  // 4. Associate deal with contact
  if (contactId && dealData.id) {
    await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealData.id}/associations/contacts/${contactId}/deal_to_contact`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

    return Response.json({ success: true, deal_id: dealData.id });
  } catch (error) {
    console.error('Error creating Sentinel deal:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});