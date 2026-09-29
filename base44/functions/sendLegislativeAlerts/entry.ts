import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow both scheduled automation and admin manual trigger
  let isAdmin = false;
  try {
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    isAdmin = true;
  } catch {
    // Called from automation (no user session) — proceed as service role
  }

  // Fetch all active subscribers
  const subscribers = await base44.asServiceRole.entities.LegislativeSubscriber.filter({ active: true });

  if (!subscribers.length) {
    return Response.json({ message: 'No active subscribers', sent: 0 });
  }

  // Get Gmail connector access token
  const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");

  // Generate the weekly digest content via LLM
  const digest = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Generate a concise weekly legislative alert digest for cybersecurity professionals and firearms rights advocates. 
    Include: 
    1. Top 3 cybersecurity policy/law updates (NIST, CMMC, state data privacy laws, federal cybersecurity bills)
    2. Top 3 Second Amendment / firearms law developments (federal legislation, notable state law changes, court decisions)
    3. A brief "Action Required" section if any immediate compliance deadlines exist
    Format as clean HTML email content (no full HTML doc wrapper, just the body content).
    Keep each item to 2-3 sentences. Use today's date context: ${new Date().toDateString()}.`,
    add_context_from_internet: true,
    model: "gemini_3_flash"
  });

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="background: linear-gradient(135deg, #06b6d4, #3b82f6); display: inline-block; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
          <span style="color: white; font-size: 20px;">🛡️</span>
        </div>
        <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Weekly Legislative Alert</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0;">Cybersecurity Policy & 2A Law Updates | ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
      <div style="background: #1e293b; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        ${digest}
      </div>
      <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center;">
        <p style="color: #64748b; font-size: 11px; margin: 0;">
          You're receiving this because you subscribed at asaadmorman.com.<br/>
          Curated by <strong style="color: #94a3b8;">Asaad Morman</strong> — Cybersecurity SME & Heritage Shield Defense Academy Co-Founder
        </p>
      </div>
    </div>
  `;

  let sent = 0;
  const errors = [];

  for (const subscriber of subscribers) {
    // Filter by interest — only send relevant content
    const hasCyber = subscriber.interests?.includes("cybersecurity") ?? true;
    const has2A = subscriber.interests?.includes("2a_law") ?? true;
    if (!hasCyber && !has2A) continue;

    const subject = `⚡ Weekly Legislative Alert — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} | Cybersecurity & 2A Updates`;

    // Send via Gmail API
    const message = [
      `To: ${subscriber.email}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      ``,
      emailHtml
    ].join('\n');

    const encoded = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encoded })
    });

    if (res.ok) {
      sent++;
      // Update last_sent timestamp
      await base44.asServiceRole.entities.LegislativeSubscriber.update(subscriber.id, {
        last_sent: new Date().toISOString()
      });
    } else {
      const err = await res.json();
      errors.push({ email: subscriber.email, error: err });
    }
  }

  return Response.json({ message: 'Alerts sent', sent, total: subscribers.length, errors });
});