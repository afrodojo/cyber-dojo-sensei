import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const TEMPLATES = {
  executive_summary: `
You are an executive reporting assistant. Generate a concise executive summary report in markdown.
Focus on: headline KPIs, top 3 insights, and a single clear recommendation.
Keep it brief (300-400 words). Use headers, bullet points, and bold for key numbers.
`,
  detailed_analysis: `
You are a data analyst. Generate a detailed lead intelligence report in markdown.
Include: executive overview, lead engagement breakdown, scoring distribution analysis, 
AI suggestion effectiveness, pipeline health, and 5+ actionable recommendations.
Be thorough (600-800 words). Use tables where appropriate (markdown format).
`,
  trend_report: `
You are a trend analyst. Generate a trend-focused report in markdown.
Focus on: scoring trends over time, engagement rate changes, suggestion adoption trends,
lead quality shifts, and forecasts. Include comparisons and trajectory analysis.
Use charts described in text (500-600 words). Highlight positive and negative trends.
`
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { period, template, report_id } = await req.json();

    // Calculate period dates
    const now = new Date();
    const periodStart = new Date(now);
    if (period === 'weekly') {
      periodStart.setDate(now.getDate() - 7);
    } else {
      periodStart.setMonth(now.getMonth() - 1);
    }

    // Fetch all relevant data
    const [leads, scores, suggestions] = await Promise.all([
      base44.asServiceRole.entities.Lead.list(),
      base44.asServiceRole.entities.LeadScore.list(),
      base44.asServiceRole.entities.AIFollowUpSuggestion.list()
    ]);

    // Filter to period
    const periodLeads = leads.filter(l => new Date(l.created_date) >= periodStart);
    const periodSuggestions = suggestions.filter(s => new Date(s.created_date) >= periodStart);

    // Compute metrics
    const totalLeads = periodLeads.length;
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + (s.overall_score || 0), 0) / scores.length)
      : 0;
    const suggestionsTotal = periodSuggestions.length;
    const suggestionsAccepted = periodSuggestions.filter(s => s.status === 'accepted' || s.status === 'implemented').length;
    const suggestionsRejected = periodSuggestions.filter(s => s.status === 'rejected').length;
    const acceptanceRate = suggestionsTotal > 0 ? Math.round((suggestionsAccepted / suggestionsTotal) * 100) : 0;

    const statusCounts = periodLeads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});

    const serviceInterestCounts = periodLeads.reduce((acc, l) => {
      if (l.service_interest) acc[l.service_interest] = (acc[l.service_interest] || 0) + 1;
      return acc;
    }, {});

    const highScoreLeads = scores.filter(s => s.overall_score >= 70).length;
    const mediumScoreLeads = scores.filter(s => s.overall_score >= 40 && s.overall_score < 70).length;
    const lowScoreLeads = scores.filter(s => s.overall_score < 40).length;

    const dataContext = `
REPORT PERIOD: ${periodStart.toDateString()} to ${now.toDateString()}
REPORT TYPE: ${period.toUpperCase()} ${template.replace('_', ' ').toUpperCase()}

LEAD METRICS:
- New leads this period: ${totalLeads}
- Total leads in system: ${leads.length}
- Lead status breakdown: ${JSON.stringify(statusCounts)}
- Service interest breakdown: ${JSON.stringify(serviceInterestCounts)}

SCORING METRICS:
- Average overall score: ${avgScore}/100
- High score leads (70+): ${highScoreLeads}
- Medium score leads (40-69): ${mediumScoreLeads}
- Low score leads (<40): ${lowScoreLeads}
- Total scored leads: ${scores.length}

AI SUGGESTION EFFECTIVENESS:
- Suggestions generated this period: ${suggestionsTotal}
- Accepted/Implemented: ${suggestionsAccepted}
- Rejected: ${suggestionsRejected}
- Pending: ${suggestionsTotal - suggestionsAccepted - suggestionsRejected}
- Acceptance rate: ${acceptanceRate}%
- Suggestion types: ${JSON.stringify(
  periodSuggestions.reduce((acc, s) => { acc[s.suggestion_type] = (acc[s.suggestion_type] || 0) + 1; return acc; }, {})
)}
`;

    // Generate report with AI
    const systemPrompt = TEMPLATES[template] || TEMPLATES.executive_summary;
    const reportContent = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nHere is the data for the report:\n${dataContext}\n\nGenerate the report now:`
    });

    // Extract key insights using AI
    const insightsResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Based on this data, extract exactly 4 key insights as a JSON array of strings. Each insight should be one concise sentence under 15 words.\n\n${dataContext}`,
      response_json_schema: {
        type: "object",
        properties: {
          insights: { type: "array", items: { type: "string" } }
        }
      }
    });

    const keyInsights = insightsResponse?.insights || [];

    // Update the report record
    if (report_id) {
      await base44.asServiceRole.entities.LeadReport.update(report_id, {
        report_content: reportContent,
        key_insights: keyInsights,
        total_leads: totalLeads,
        avg_score: avgScore,
        suggestions_accepted: suggestionsAccepted,
        suggestions_total: suggestionsTotal,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: now.toISOString().split('T')[0],
        status: 'ready'
      });
    }

    return Response.json({
      success: true,
      report_content: reportContent,
      key_insights: keyInsights,
      metrics: { totalLeads, avgScore, suggestionsAccepted, suggestionsTotal, acceptanceRate }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});