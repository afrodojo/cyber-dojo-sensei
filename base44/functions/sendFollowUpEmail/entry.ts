import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { followUpId } = await req.json();

    if (!followUpId) {
      return Response.json({ error: 'followUpId required' }, { status: 400 });
    }

    // Get follow-up details
    const followUp = await base44.asServiceRole.entities.FollowUp.get(followUpId);

    if (!followUp) {
      return Response.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('gmail');

    // Create email message
    const emailMessage = [
      `To: ${followUp.contact_email}`,
      `Subject: ${followUp.subject}`,
      'Content-Type: text/html; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      followUp.body
    ].join('\r\n');

    const encodedMessage = btoa(emailMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Send via Gmail API
    const sendRes = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedMessage
        })
      }
    );

    if (!sendRes.ok) {
      const error = await sendRes.json();
      throw new Error(error.error?.message || 'Failed to send email');
    }

    // Update follow-up status
    await base44.asServiceRole.entities.FollowUp.update(followUpId, {
      status: 'sent',
      sent_date: new Date().toISOString()
    });

    return Response.json({
      success: true,
      message: `Email sent to ${followUp.contact_email}`
    });
  } catch (error) {
    const followUpId = (await req.json()).followUpId;
    if (followUpId) {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.FollowUp.update(followUpId, {
        status: 'failed',
        error_message: error.message
      });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
});