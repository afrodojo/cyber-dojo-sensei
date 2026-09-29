import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow both scheduled (no user) and manual admin invocation
  let isScheduled = false;
  try {
    const body = await req.clone().json().catch(() => ({}));
    isScheduled = body?.automation === true;
  } catch (_) {}

  if (!isScheduled) {
    const user = await base44.auth.me().catch(() => null);
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Fetch all active subscribers
  const subscribers = await base44.asServiceRole.entities.LegislativeAlertSubscriber.filter({ active: true });

  if (!subscribers.length) {
    return Response.json({ message: 'No active subscribers', sent: 0 });
  }

  // Generate the weekly digest using AI
  const digest = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are a legislative intelligence analyst for Asaad Morman, a cybersecurity and defense expert.
Generate a professional weekly legislative alert digest covering:
1. CYBERSECURITY LAWS & REGULATIONS: Recent federal/state cybersecurity legislation, CISA advisories, FISMA updates, state data breach notification changes, AI/privacy regulation updates (last 7 days).
2. SECOND AMENDMENT & FIREARMS LAWS: New state carry law changes, reciprocity updates, federal legislation, court rulings affecting 2A rights, concealed carry permit changes (last 7 days).

Format the response as clean HTML email content (no <html>/<body> wrapper, just inner content) with:
- A brief 2-sentence intro
- Two clearly labeled sections with bullet points
- A footer noting this is from Heritage Shield Defense Academy / Asaad Morman Cybersecurity

Keep it concise, professional, and actionable. Use inline styles for any formatting.`,
    add_context_from_internet: true,
    model: 'gemini_3_flash'
  });

  // Get Gmail connector
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

  let sent = 0;
  const errors = [];
  const weekStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const subject = `⚖️ Weekly Legislative Alert: Cybersecurity & 2A Law Updates — ${weekStr}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0891b2, #1d4ed8); padding: 32px 40px;">
        <div style="font-size: 22px; font-weight: bold; color: #fff;">🛡️ Legislative Alert Digest</div>
        <div style="font-size: 13px; color: #bae6fd; margin-top: 4px;">Cybersecurity & Second Amendment Law Monitor</div>
        <div style="font-size: 12px; color: #93c5fd; margin-top: 2px;">Week of ${weekStr}</div>
      </div>
      <div style="padding: 32px 40px; line-height: 1.7; font-size: 14px;">
        ${digest}
      </div>
      <div style="background: #1e293b; padding: 20px 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #334155;">
        <p style="margin:0;">Sent by <strong style="color:#94a3b8;">Asaad Morman</strong> · Heritage Shield Defense Academy</p>
        <p style="margin:4px 0 0;">You're receiving this because you subscribed to legislative alerts. 
        <a href="mailto:cyberdojosensai@gmail.com?subject=Unsubscribe" style="color:#0891b2;">Unsubscribe</a></p>
      </div>
    </div>
  `;

  for (const sub of subscribers) {
    const message = [
      `To: ${sub.email}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
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
      await base44.asServiceRole.entities.LegislativeAlertSubscriber.update(sub.id, {
        last_sent: new Date().toISOString()
      });
    } else {
      const err = await res.text();
      errors.push({ email: sub.email, error: err });
    }
  }

  return Response.json({ success: true, sent, errors, total: subscribers.length });
});