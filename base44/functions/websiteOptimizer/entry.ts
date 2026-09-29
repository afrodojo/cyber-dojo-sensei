import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch analytics and opportunities data
    const [analyticsEvents, opportunities] = await Promise.all([
      base44.entities.AnalyticsEvent.list('-created_date', 100).catch(() => []),
      base44.entities.OpportunityData.list('-created_date', 50).catch(() => [])
    ]);

    // Calculate top search keywords and trends
    const searchTrends = opportunities
      .filter(o => o.type === 'search-trend')
      .sort((a, b) => (b.search_volume || 0) - (a.search_volume || 0))
      .slice(0, 10);

    const contractingOpps = opportunities
      .filter(o => o.type.includes('contracting'))
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

    const rdAsks = opportunities
      .filter(o => o.type === 'rd-ask')
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

    const localNeeds = opportunities
      .filter(o => o.type === 'local-need')
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

    // Get top pages from analytics
    const pageViews = {};
    analyticsEvents
      .filter(e => e.event_name === 'page_view')
      .forEach(e => {
        pageViews[e.page] = (pageViews[e.page] || 0) + 1;
      });

    const topPages = Object.entries(pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }));

    // Generate optimization prompt
    const optimizationPrompt = `You are a strategic website optimizer for a cybersecurity professional. Analyze the following data and generate specific content update recommendations.

ANALYTICS DATA:
- Top Pages: ${JSON.stringify(topPages)}
- Total Events: ${analyticsEvents.length}

SEARCH TRENDS & LOCAL NEEDS:
${searchTrends.map(t => `- ${t.title} (Volume: ${t.search_volume})`).join('\n')}

CONTRACTING OPPORTUNITIES (Public & Private):
${contractingOpps.slice(0, 5).map(c => `- ${c.title} from ${c.agency_name} (Relevance: ${c.relevance_score}/100)`).join('\n')}

R&D ASKS FROM AGENCIES:
${rdAsks.slice(0, 5).map(r => `- ${r.title}: ${r.description}`).join('\n')}

LOCAL NEEDS:
${localNeeds.slice(0, 5).map(l => `- ${l.title}: ${l.description}`).join('\n')}

Based on this data, provide a JSON response with:
1. "priority_updates" - Array of 3-5 high-priority content updates with page recommendations
2. "keyword_recommendations" - Keywords to emphasize based on trends and opportunities
3. "page_recommendations" - Specific pages that need updates and why
4. "new_content_ideas" - Blog post, case study, or service ideas based on opportunities
5. "opportunity_summary" - Brief summary of top opportunities to pursue
6. "implementation_strategy" - Step-by-step plan for website updates

Make recommendations that directly connect website content to market opportunities.`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: optimizationPrompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          priority_updates: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                page: { type: 'string' },
                update: { type: 'string' },
                reasoning: { type: 'string' }
              }
            }
          },
          keyword_recommendations: { type: 'array', items: { type: 'string' } },
          page_recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                page: { type: 'string' },
                reason: { type: 'string' }
              }
            }
          },
          new_content_ideas: {
            type: 'array',
            items: { type: 'string' }
          },
          opportunity_summary: { type: 'string' },
          implementation_strategy: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    });

    return Response.json({
      analysis,
      data_summary: {
        total_opportunities: opportunities.length,
        search_trends_count: searchTrends.length,
        contracting_opportunities_count: contractingOpps.length,
        rd_asks_count: rdAsks.length,
        local_needs_count: localNeeds.length,
        top_pages: topPages
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});