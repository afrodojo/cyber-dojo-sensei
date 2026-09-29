import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { pageTitle, pageDescription, pageContent, pagePath, pageCategory } = await req.json();

    if (!pageContent || pageContent.trim().length === 0) {
      return Response.json({ error: 'Page content is required' }, { status: 400 });
    }

    const prompt = `You are an expert SEO consultant. Analyze the following page content and provide comprehensive SEO recommendations.

Page Title: ${pageTitle || 'Not set'}
Current Description: ${pageDescription || 'Not set'}
Page Path: ${pagePath || 'Not specified'}
Category: ${pageCategory || 'Not specified'}

Content to analyze:
${pageContent.substring(0, 2000)}

Please provide a JSON response with:
1. "suggested_title" - A compelling SEO-optimized title (50-60 chars)
2. "suggested_description" - An SEO-optimized meta description (150-160 chars)
3. "primary_keywords" - Array of 5-8 primary keywords relevant to the content
4. "long_tail_keywords" - Array of 5-8 long-tail keywords (3+ words)
5. "keyword_density" - Object with keyword frequencies (top 5 keywords and their density percentages)
6. "seo_score" - Number from 1-100 rating current SEO quality
7. "recommendations" - Array of 5-7 specific recommendations to improve SEO
8. "internal_linking_suggestions" - Array of 3-5 internal pages/topics to link to
9. "content_gaps" - Array of topics/subtopics missing from the content
10. "keyword_opportunities" - Array of underutilized keywords with high search potential`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          suggested_title: { type: 'string' },
          suggested_description: { type: 'string' },
          primary_keywords: { type: 'array', items: { type: 'string' } },
          long_tail_keywords: { type: 'array', items: { type: 'string' } },
          keyword_density: { type: 'object' },
          seo_score: { type: 'number' },
          recommendations: { type: 'array', items: { type: 'string' } },
          internal_linking_suggestions: { type: 'array', items: { type: 'string' } },
          content_gaps: { type: 'array', items: { type: 'string' } },
          keyword_opportunities: { type: 'array', items: { type: 'string' } }
        },
        required: ['suggested_title', 'suggested_description', 'primary_keywords', 'seo_score', 'recommendations']
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});