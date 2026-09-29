import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { focus_topics, include_type = 'all' } = await req.json();

    // Gather relevant content
    const [threatIntel, recentPosts, caseStudies, webinars] = await Promise.all([
      base44.entities.ThreatIntelligence.list('-published_date', 5),
      base44.entities.BlogPost.filter({ published: true }, '-created_date', 3),
      base44.entities.CaseStudy.list('-created_date', 2),
      base44.entities.Webinar.filter({ status: 'upcoming' }, '-date', 1)
    ]);

    // Use LLM to generate newsletter content
    const threatSummary = threatIntel.map(t => `${t.title} (${t.severity}): ${t.description}`).join('\n\n');
    
    const prompt = `You are a professional cybersecurity newsletter writer. Create a compelling newsletter that:
    
1. Opens with an engaging hook about current cybersecurity landscape
2. Includes threat summary from: ${threatSummary}
3. Highlights key trends and recommendations
4. Suggests relevant internal resources (case studies, webinars)
5. Ends with a call-to-action

Focus on: ${focus_topics || 'emerging threats, compliance, red team operations'}

Make it professional yet accessible to executives and security teams. Include actionable insights.

Structure the newsletter with clear sections: Opening Hook, Threat Summary, Key Insights, Resources, Call-to-Action.`;

    const newsletterContent = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          subject_line: { type: 'string' },
          opening_hook: { type: 'string' },
          threat_summary: { type: 'string' },
          key_insights: { type: 'array', items: { type: 'string' } },
          resource_recommendations: { type: 'array', items: { type: 'string' } },
          call_to_action: { type: 'string' },
          full_html: { type: 'string' }
        }
      }
    });

    // Create a draft blog post from the newsletter
    const postTitle = newsletterContent.subject_line.replace('Newsletter: ', '').replace('[Weekly]', '').trim();
    
    const draftPost = {
      title: postTitle,
      excerpt: newsletterContent.opening_hook,
      content: `# ${postTitle}\n\n${newsletterContent.opening_hook}\n\n## Key Insights\n\n${newsletterContent.key_insights.map(i => `- ${i}`).join('\n')}\n\n## Threat Updates\n\n${newsletterContent.threat_summary}\n\n## Recommended Resources\n\n${newsletterContent.resource_recommendations.map(r => `- ${r}`).join('\n')}\n\n## Next Steps\n\n${newsletterContent.call_to_action}`,
      category: 'threat-intelligence',
      featured: false,
      published: false,
      tags: ['newsletter', 'threat-intelligence', 'weekly'],
      meta_title: postTitle,
      meta_description: newsletterContent.opening_hook.substring(0, 160)
    };

    // Optionally save as draft
    let savedPost = null;
    try {
      savedPost = await base44.entities.BlogPost.create(draftPost);
    } catch (e) {
      console.error('Failed to save draft post:', e);
    }

    return Response.json({
      status: 'success',
      newsletter: newsletterContent,
      draft_post_id: savedPost?.id || null,
      sources_used: {
        threat_intel_count: threatIntel.length,
        recent_posts: recentPosts.length,
        case_studies: caseStudies.length,
        upcoming_webinars: webinars.length
      },
      recommendation: 'Review the generated newsletter, customize as needed, then publish to subscribers via your email service.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});