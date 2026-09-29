import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    // Fetch all scheduled executive briefings
    const briefings = await base44.asServiceRole.entities.ExecutiveBriefing.list('-created_date', 100);
    const scheduledBriefings = briefings.filter(b => b.scheduled_datetime && b.status !== 'cancelled');

    let synced = 0;
    let errors = [];

    for (const briefing of scheduledBriefings) {
      try {
        const startTime = new Date(briefing.scheduled_datetime);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        const event = {
          summary: `Executive Briefing: ${briefing.name}`,
          description: `Executive Briefing with ${briefing.name} from ${briefing.company}.\n\nTopics: ${(briefing.topics_of_interest || []).join(', ')}\n\nCurrent Challenges: ${briefing.current_challenges || 'N/A'}\n\nMeeting Type: ${briefing.meeting_type}`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'America/New_York'
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'America/New_York'
          },
          location: briefing.meeting_type === 'in-person' ? briefing.company : 'Virtual Meeting',
          attendees: [
            { email: briefing.email }
          ]
        };

        const createRes = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
          }
        );

        if (!createRes.ok) {
          const errorData = await createRes.json();
          errors.push(`Failed to sync ${briefing.name}: ${errorData.error?.message || 'Unknown error'}`);
        } else {
          synced++;
        }
      } catch (error) {
        errors.push(`Error processing ${briefing.name}: ${error.message}`);
      }
    }

    return Response.json({
      success: true,
      synced,
      total: scheduledBriefings.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});