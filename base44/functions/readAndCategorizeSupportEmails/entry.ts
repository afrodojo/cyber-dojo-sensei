import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('gmail');

    // Fetch recent emails from Gmail inbox
    const messagesRes = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10',
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    const messagesData = await messagesRes.json();
    const messages = messagesData.messages || [];

    const inquiries = [];

    for (const message of messages) {
      // Get full message details
      const detailRes = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      const messageData = await detailRes.json();
      const headers = messageData.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
      const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

      // Extract body
      let body = '';
      if (messageData.payload.parts) {
        const part = messageData.payload.parts.find(p => p.mimeType === 'text/plain');
        if (part && part.body.data) {
          body = atob(part.body.data);
        }
      } else if (messageData.payload.body?.data) {
        body = atob(messageData.payload.body.data);
      }

      // Use LLM to categorize and summarize
      const categorization = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Categorize this support inquiry and provide a brief summary.

Subject: ${subject}
From: ${from}
Body: ${body}

Provide JSON response with:
{
  "category": "bug|feature-request|billing|account|general-question|technical-support|other",
  "priority": "low|medium|high|urgent",
  "summary": "brief summary of the inquiry"
}`,
        response_json_schema: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            priority: { type: 'string' },
            summary: { type: 'string' }
          }
        }
      });

      // Check if inquiry already exists
      const existing = await base44.asServiceRole.entities.SupportInquiry.filter({ email_id: message.id });
      
      if (existing.length === 0) {
        // Create new inquiry
        const inquiry = await base44.asServiceRole.entities.SupportInquiry.create({
          email_id: message.id,
          from,
          subject,
          body: body.substring(0, 5000), // Limit body size
          category: categorization.category,
          priority: categorization.priority,
          summary: categorization.summary,
          received_date: new Date(date).toISOString(),
          status: 'new'
        });
        inquiries.push(inquiry);
      }
    }

    return Response.json({
      success: true,
      inquiries_processed: inquiries.length,
      inquiries
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});