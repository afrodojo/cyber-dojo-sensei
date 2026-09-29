import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Parse the incoming grant data from entity automation
    const { data } = await req.json();
    
    if (!data || !data.title) {
      return Response.json({ error: 'Missing grant data' }, { status: 400 });
    }

    const grant = data;
    
    // Get the current user (admin) email
    const user = await base44.auth.me();
    if (!user || !user.email) {
      return Response.json({ error: 'User email not available' }, { status: 400 });
    }

    // Format deadline for display
    const deadlineDate = new Date(grant.deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
    const deadlineFormatted = deadlineDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Build email body
    const emailBody = `
<html>
  <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      
      <h2 style="color: #00ffff; border-bottom: 2px solid #00ffff; padding-bottom: 10px;">
        🎓 New PhD Grant Opportunity Discovered
      </h2>
      
      <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #00ffff; margin-top: 0;">${grant.title}</h3>
        
        <div style="margin: 15px 0;">
          <p><strong>Funding Provider:</strong> ${grant.provider}</p>
          <p><strong>Funding Amount:</strong> <span style="color: #00ff00; font-weight: bold;">$${typeof grant.amount === 'number' ? grant.amount.toLocaleString() : grant.amount}</span></p>
          <p><strong>Application Deadline:</strong> <span style="color: ${daysUntilDeadline < 30 ? '#ff4444' : '#00ff00'}; font-weight: bold;">${deadlineFormatted}</span> <em>(${daysUntilDeadline} days remaining)</em></p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <h4 style="color: #1a1d26;">Description</h4>
        <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #00ffff; border-radius: 3px;">
          ${grant.description}
        </p>

        <h4 style="color: #1a1d26;">Eligibility Requirements</h4>
        <div style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #00ffff; border-radius: 3px;">
          ${Array.isArray(grant.eligibility) ? grant.eligibility.map(e => `<p>• ${e}</p>`).join('') : `<p>• ${grant.eligibility}</p>`}
        </div>

        <h4 style="color: #1a1d26;">Grant Category</h4>
        <p><span style="background-color: #00ffff; color: #1a1d26; padding: 5px 10px; border-radius: 3px; font-weight: bold;">${grant.category || 'Research'}</span></p>
      </div>

      <div style="background-color: #1a1d26; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <a href="${grant.application_url}" 
           target="_blank" 
           rel="noopener noreferrer"
           style="display: inline-block; background-color: #00ffff; color: #1a1d26; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
          Start Application
        </a>
      </div>

      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 13px; color: #666; margin-top: 20px;">
        <p>This grant has been automatically discovered and added to your PhD Grants Hub.</p>
        <p>View all grants: <a href="https://cyberdojosensei.eds-360.com/PhDGrantsHub" style="color: #00ffff; text-decoration: none;">cyberdojosensei.eds-360.com/PhDGrantsHub</a></p>
        <p><em>Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</em></p>
      </div>

    </div>
  </body>
</html>
    `;

    // Send email via Gmail
    const emailResult = await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `🎓 New PhD Grant: ${grant.title} (Deadline: ${deadlineFormatted})`,
      body: emailBody,
      from_name: 'PhD Grants Hub'
    });

    console.log(`[GRANT NOTIFICATION] Sent email to ${user.email} for grant: ${grant.title}`);

    // Add calendar event for deadline
    let calendarEventId = null;
    try {
      const googleCalendarConn = await base44.connectors.getConnection('googlecalendar');
      if (googleCalendarConn) {
        // Create event on Google Calendar
        const eventBody = {
          summary: `📋 ${grant.title} - Application Deadline`,
          description: `PhD Grant Application Deadline\n\nFunding: $${typeof grant.amount === 'number' ? grant.amount.toLocaleString() : grant.amount}\nProvider: ${grant.provider}\n\nApplication URL: ${grant.application_url}`,
          start: {
            date: grant.deadline, // All-day event
          },
          end: {
            date: new Date(new Date(grant.deadline).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next day
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 1440 }, // 1 day before
              { method: 'notification', minutes: 60 }, // 1 hour before
            ],
          },
        };

        const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${googleCalendarConn.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventBody),
        });

        if (calendarResponse.ok) {
          const eventData = await calendarResponse.json();
          calendarEventId = eventData.id;
          console.log(`[CALENDAR] Added event to Google Calendar: ${eventData.id}`);
        } else {
          console.warn(`[CALENDAR] Failed to add event: ${calendarResponse.status}`);
        }
      }
    } catch (calendarError) {
      console.warn(`[CALENDAR] Google Calendar connection not available: ${calendarError.message}`);
    }

    return Response.json({
      success: true,
      message: 'Grant notification sent and calendar event created',
      recipient: user.email,
      grant_title: grant.title,
      deadline: grant.deadline,
      calendar_event_id: calendarEventId
    });
  } catch (error) {
    console.error('Error sending grant notification:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});