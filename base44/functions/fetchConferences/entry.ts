import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let isScheduled = false;
    try {
      const body = await req.clone().json().catch(() => ({}));
      isScheduled = !!body?.automation;
    } catch (_) {}

    if (!isScheduled) {
      const user = await base44.auth.me().catch(() => null);
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: "List 15 upcoming cybersecurity conferences in 2026. For each: name, 1-sentence description, start_date (YYYY-MM-DD), end_date (YYYY-MM-DD), location (city, country), virtual (true/false), url (official website), organizer. Include RSA, Black Hat, DEF CON, BSides, ShmooCon, SANS, Gartner, Hack in the Box, OWASP AppSec. Prioritize events in the next 6 months.",
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        properties: {
          conferences: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                start_date: { type: "string" },
                end_date: { type: "string" },
                location: { type: "string" },
                virtual: { type: "boolean" },
                url: { type: "string" },
                organizer: { type: "string" }
              }
            }
          }
        }
      }
    });

    const conferences = result.conferences || [];

    const existing = await base44.asServiceRole.entities.Conference.list('-created_date', 500);
    const existingNames = new Set(existing.map(c => (c.name || '').toLowerCase()));

    const newConferences = conferences.filter(c => c.name && !existingNames.has(c.name.toLowerCase()));

    if (newConferences.length > 0) {
      await base44.asServiceRole.entities.Conference.bulkCreate(
        newConferences.map(c => ({
          name: c.name,
          description: c.description || '',
          start_date: c.start_date || '',
          end_date: c.end_date || '',
          location: c.location || '',
          virtual: c.virtual || false,
          url: c.url || '',
          organizer: c.organizer || ''
        }))
      );
    }

    return Response.json({
      success: true,
      fetched: conferences.length,
      added: newConferences.length,
      total: existing.length + newConferences.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});