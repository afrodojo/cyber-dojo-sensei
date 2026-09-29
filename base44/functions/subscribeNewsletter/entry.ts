import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { email, name = "", source = "website" } = await req.json();

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check for duplicate subscriber
  const existing = await base44.asServiceRole.entities.Subscriber.filter({ email: normalizedEmail });
  if (existing.length > 0) {
    return Response.json({ success: true, alreadySubscribed: true });
  }

  // 2. Save subscriber to DB
  await base44.asServiceRole.entities.Subscriber.create({
    email: normalizedEmail,
    name: name.trim(),
    source,
    active: true,
  });

  // 3. Send welcome email via Gmail
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");

    const firstName = name.trim().split(" ")[0] || "there";
    const emailBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
    <div style="background: linear-gradient(135deg, #0891b2, #2563eb); border-radius: 12px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <h1 style="color: #fff; font-size: 24px; margin: 0 0 8px;">Welcome to the Sentinel Intel Feed</h1>
      <p style="color: #bfdbfe; margin: 0; font-size: 15px;">Cybersecurity insights powered by the Sentinel Ecosystem</p>
    </div>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.7;">Hi ${firstName},</p>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.7;">
      Thank you for subscribing! You're now part of an exclusive community receiving cutting-edge cybersecurity intelligence from <strong style="color: #22d3ee;">Asaad Morman</strong> — PhD Researcher, TS/SCI Cleared SME, and Founder of CyberDojo Solutions.
    </p>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.7;">Here's what you can expect:</p>
    <ul style="color: #94a3b8; font-size: 15px; line-height: 2;">
      <li>🛡 <strong style="color: #e2e8f0;">Threat Intelligence Briefings</strong> — CISA, NSA, FBI alerts decoded</li>
      <li>🤖 <strong style="color: #e2e8f0;">Sentinel Ecosystem Updates</strong> — Latest research on autonomous AI security</li>
      <li>🎯 <strong style="color: #e2e8f0;">Red Team Insights</strong> — TTPs, attack simulations, and defensive strategies</li>
      <li>📚 <strong style="color: #e2e8f0;">Exclusive Content</strong> — Webinars, case studies, and research previews</li>
    </ul>
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://cyberdojo.base44.app" style="background: linear-gradient(135deg, #0891b2, #2563eb); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">Visit the Portal →</a>
    </div>
    <p style="color: #475569; font-size: 13px; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 32px; text-align: center;">
      Asaad Morman | Cybersecurity SME | Fredericksburg, VA<br>
      <a href="mailto:cyberdojosensai@gmail.com" style="color: #0891b2;">cyberdojosensai@gmail.com</a> | 657-658-5859
    </p>
  </div>
</body>
</html>`;

    const mimeMessage = [
      `To: ${normalizedEmail}`,
      `Subject: Welcome to the Sentinel Intel Feed 🛡`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      emailBody,
    ].join("\r\n");

    const encoded = btoa(unescape(encodeURIComponent(mimeMessage)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encoded }),
    });
  } catch (err) {
    console.error("Gmail send error:", err.message);
  }

  // 4. Add contact to HubSpot
  try {
    const { accessToken: hsToken } = await base44.asServiceRole.connectors.getConnection("hubspot");

    const nameParts = name.trim().split(" ");
    const hubspotBody = {
      properties: {
        email: normalizedEmail,
        firstname: nameParts[0] || "",
        lastname: nameParts.slice(1).join(" ") || "",
        hs_lead_status: "NEW",
        lifecyclestage: "subscriber",
        lead_source: `Newsletter — ${source}`,
      },
    };

    // Create or update contact
    await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hsToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hubspotBody),
    });
  } catch (err) {
    console.error("HubSpot sync error:", err.message);
  }

  return Response.json({ success: true });
});