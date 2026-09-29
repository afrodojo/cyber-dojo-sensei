import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { leadId, triggerEvent } = body;

    if (!leadId) {
      return Response.json({ error: 'Missing leadId' }, { status: 400 });
    }

    // Fetch lead
    const lead = await base44.asServiceRole.entities.Lead.get(leadId);
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Fetch lead score
    const scores = await base44.asServiceRole.entities.LeadScore.filter({
      lead_id: leadId
    });
    const leadScore = scores.length > 0 ? scores[0] : null;

    // Fetch recent emails
    const emails = await base44.asServiceRole.entities.EmailFollowUp.filter(
      { recipient_email: lead.email },
      '-created_date',
      5
    );

    // Fetch recent briefings
    const briefings = await base44.asServiceRole.entities.ExecutiveBriefing.filter(
      { email: lead.email },
      '-created_date',
      3
    );

    // Build context for LLM
    const context = `
Lead: ${lead.name}
Company: ${lead.company}
Title: ${lead.title || 'Not specified'}
Email: ${lead.email}
Service Interest: ${lead.service_interest || 'General'}
Budget Range: ${lead.budget_range || 'Not specified'}
Timeline: ${lead.timeline || 'Not specified'}
Current Status: ${lead.status}

Lead Score: ${leadScore ? leadScore.overall_score : 'N/A'}/100
- Engagement: ${leadScore ? leadScore.engagement_score : 'N/A'}
- Briefing: ${leadScore ? leadScore.briefing_score : 'N/A'}
- Fit: ${leadScore ? leadScore.fit_score : 'N/A'}

Recent Interactions:
Emails sent: ${emails.length}
${emails.map((e, i) => `${i + 1}. ${e.subject} (${e.status})`).join('\n')}

Briefings: ${briefings.length}
${briefings.map((b, i) => `${i + 1}. ${b.meeting_type} meeting (${b.status})`).join('\n')}

Trigger Event: ${triggerEvent || 'Lead assessment'}
`;

    // Call LLM to generate suggestions
    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a sales intelligence AI. Analyze the following lead profile and interactions, then provide 3 personalized follow-up suggestions. For each suggestion, include: title, detailed content/template, reasoning, and confidence level (0-100).

${context}

Provide suggestions in JSON format with array of objects containing: type (email_template/call_strategy/content_recommendation/next_action/timing), title, content, reasoning, confidence.`,
      response_json_schema: {
        type: 'object',
        properties: {
          suggestions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
                reasoning: { type: 'string' },
                confidence: { type: 'number' }
              }
            }
          }
        }
      }
    });

    const suggestions = llmResponse.suggestions || [];
    const createdSuggestions = [];

    for (const suggestion of suggestions) {
      const created = await base44.asServiceRole.entities.AIFollowUpSuggestion.create({
        lead_id: leadId,
        lead_name: lead.name,
        lead_email: lead.email,
        suggestion_type: suggestion.type,
        suggestion_title: suggestion.title,
        suggestion_content: suggestion.content,
        reasoning: suggestion.reasoning,
        confidence: suggestion.confidence,
        trigger_event: triggerEvent || 'lead_scored',
        context_data: JSON.stringify({
          leadScore: leadScore ? leadScore.overall_score : null,
          emailCount: emails.length,
          briefingCount: briefings.length
        })
      });
      createdSuggestions.push(created);
    }

    return Response.json({
      success: true,
      suggestionsCreated: createdSuggestions.length,
      suggestions: createdSuggestions
    });
  } catch (error) {
    console.error('AI suggestions generation error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});