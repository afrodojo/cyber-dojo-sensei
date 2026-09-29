import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    // Support both direct call (from BlogAdmin) and entity automation trigger
    let blogPost = payload.data || payload.blogPost;
    const blogPostId = payload.event?.entity_id || payload.blogPostId;

    // If triggered by automation, fetch the full post
    if (!blogPost && blogPostId) {
      blogPost = await base44.asServiceRole.entities.BlogPost.get(blogPostId);
    }

    if (!blogPost) {
      return Response.json({ error: 'No blog post data provided' }, { status: 400 });
    }

    // Only generate if post is published
    if (!blogPost.published) {
      return Response.json({ message: 'Post is not published, skipping social generation' });
    }

    // Use AI to generate platform-specific social posts
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a social media expert for Asaad Morman, a cybersecurity entrepreneur.
      
Generate social media posts for the following blog article:

Title: ${blogPost.title}
Excerpt: ${blogPost.excerpt}
Category: ${blogPost.category}
Tags: ${blogPost.tags?.join(', ') || ''}

Create 3 distinct social posts:
1. LinkedIn: Professional tone, 150-250 words, highlight key insights, end with a question to drive engagement. Include relevant hashtags.
2. Twitter/X: Punchy, under 280 characters, hook-driven, 2-3 hashtags max.
3. Facebook: Conversational, 100-150 words, slightly more casual than LinkedIn, focus on value and a call to action.

Return JSON in this exact format:
{
  "linkedin": "post content here",
  "twitter": "post content here",
  "facebook": "post content here"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          linkedin: { type: "string" },
          twitter: { type: "string" },
          facebook: { type: "string" }
        }
      }
    });

    const platforms = ['linkedin', 'twitter', 'facebook'];
    const created = [];

    for (const platform of platforms) {
      const content = result[platform];
      if (content) {
        const post = await base44.asServiceRole.entities.SocialPost.create({
          platform,
          content,
          status: 'draft',
          source_type: 'blog',
          source_id: blogPost.id,
          source_title: blogPost.title,
          hashtags: blogPost.tags || []
        });
        created.push(post);
      }
    }

    return Response.json({
      success: true,
      message: `Created ${created.length} social media drafts`,
      posts: created
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});