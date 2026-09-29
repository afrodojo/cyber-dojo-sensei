import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Entity automation payload: { event, data, old_data, changed_fields }
    const post = body.data;
    if (!post) {
      return Response.json({ error: 'No blog post data in payload' }, { status: 400 });
    }

    // Fetch all active subscribers
    const subscribers = await base44.asServiceRole.entities.Subscriber.filter({ active: true });

    if (subscribers.length === 0) {
      return Response.json({ success: true, message: 'No active subscribers', sent: 0 });
    }

    // Get Gmail access token (shared connector)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const subject = `New Article: ${post.title}`;
    const excerpt = post.excerpt || '';
    const postUrl = `${Deno.env.get('BASE44_APP_URL') || ''}/BlogPostDetail?id=${post.id}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h1 style="color: #0ea5e9;">${post.title}</h1>
        ${excerpt ? `<p style="font-size: 16px; color: #475569;">${excerpt}</p>` : ''}
        <a href="${postUrl}" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #2563eb); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Read Full Article</a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">You're receiving this because you subscribed to Asaad Morman's cybersecurity insights. Reply to unsubscribe.</p>
      </div>
    `;

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const sub of subscribers) {
      try {
        const emailMessage = [
          `To: ${sub.email}`,
          `Subject: ${subject}`,
          'Content-Type: text/html; charset="UTF-8"',
          'MIME-Version: 1.0',
          '',
          htmlBody
        ].join('\r\n');

        const encodedMessage = btoa(unescape(encodeURIComponent(emailMessage)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

        const sendRes = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: encodedMessage })
          }
        );

        if (sendRes.ok) {
          sent++;
        } else {
          const err = await sendRes.json();
          failed++;
          errors.push(`${sub.email}: ${err.error?.message || 'unknown error'}`);
        }
      } catch (err) {
        failed++;
        errors.push(`${sub.email}: ${err.message}`);
      }
    }

    return Response.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
      errors: errors.slice(0, 10)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});