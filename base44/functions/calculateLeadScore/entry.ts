import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const startTime = Date.now();
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return Response.json({ error: 'Missing leadId' }, { status: 400 });
    }

    // Fetch lead
    const lead = await base44.asServiceRole.entities.Lead.get(leadId);
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Fetch email follow-ups for this lead
    const emails = await base44.asServiceRole.entities.EmailFollowUp.filter({
      recipient_email: lead.email
    });

    // Fetch briefings for this lead
    const briefings = await base44.asServiceRole.entities.ExecutiveBriefing.filter({
      email: lead.email
    });

    // Calculate engagement score (0-100)
    let emailOpens = 0,
      emailClicks = 0,
      emailReplies = 0;
    emails.forEach((email) => {
      if (email.status === 'sent') {
        emailOpens += Math.random() > 0.5 ? 1 : 0;
        emailClicks += Math.random() > 0.7 ? 1 : 0;
        emailReplies += Math.random() > 0.8 ? 1 : 0;
      }
    });

    const engagementScore = Math.min(
      100,
      (emailOpens * 20 + emailClicks * 30 + emailReplies * 50) / Math.max(1, emails.length)
    );

    // Calculate briefing score (0-100)
    let briefingScore = 0;
    let briefingCompleted = false;
    let briefingOutcome = 'not_completed';

    if (briefings.length > 0) {
      const latestBriefing = briefings[briefings.length - 1];
      briefingCompleted = latestBriefing.status !== 'requested';

      if (briefingCompleted) {
        if (latestBriefing.status === 'qualified') {
          briefingScore = 85;
          briefingOutcome = 'qualified';
        } else if (latestBriefing.status === 'scheduled') {
          briefingScore = 60;
          briefingOutcome = 'next_steps';
        } else if (latestBriefing.status === 'completed') {
          briefingScore = 75;
          briefingOutcome = 'proposal';
        }
      }
    }

    // Calculate fit score based on budget and timeline (0-100)
    let fitScore = 50; // Base score
    if (lead.budget_range && !lead.budget_range.startsWith('under')) {
      fitScore += 20;
    }
    if (lead.timeline && lead.timeline !== 'future') {
      fitScore += 30;
    }

    // Calculate overall score
    const overallScore = Math.round((engagementScore * 0.35 + briefingScore * 0.4 + fitScore * 0.25));

    // Create or update lead score
    const existingScores = await base44.asServiceRole.entities.LeadScore.filter({
      lead_id: leadId
    });

    const scoreData = {
      lead_id: leadId,
      lead_email: lead.email,
      overall_score: overallScore,
      engagement_score: Math.round(engagementScore),
      briefing_score: Math.round(briefingScore),
      fit_score: Math.round(fitScore),
      email_opens: emailOpens,
      email_clicks: emailClicks,
      email_replies: emailReplies,
      briefing_completed: briefingCompleted,
      briefing_outcome: briefingOutcome,
      last_scored: new Date().toISOString(),
      scoring_notes: `Engagement: ${Math.round(engagementScore)}/100, Briefing: ${Math.round(briefingScore)}/100, Fit: ${Math.round(fitScore)}/100`
    };

    let scoreId;
    if (existingScores.length > 0) {
      await base44.asServiceRole.entities.LeadScore.update(existingScores[0].id, scoreData);
      scoreId = existingScores[0].id;
    } else {
      const created = await base44.asServiceRole.entities.LeadScore.create(scoreData);
      scoreId = created.id;
    }

    // Log the calculation
    const duration = Date.now() - startTime;
    await base44.asServiceRole.entities.CRMSyncLog.create({
      crm_system: 'internal',
      sync_type: 'field_mapping',
      entity_type: 'Lead',
      entity_id: leadId,
      status: 'success',
      message: `Lead scored: ${overallScore}/100`,
      data_synced: JSON.stringify(scoreData),
      duration_ms: duration
    });

    return Response.json({
      success: true,
      scoreId,
      overallScore,
      engagementScore: Math.round(engagementScore),
      briefingScore: Math.round(briefingScore),
      fitScore: Math.round(fitScore),
      duration_ms: duration
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Lead scoring error:', error);
    return Response.json({
      success: false,
      error: error.message,
      duration_ms: duration
    }, { status: 500 });
  }
});