import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { articleId, action } = await req.json();

    if (!articleId || !action) {
      return Response.json({ error: 'articleId and action are required' }, { status: 400 });
    }

    const article = await base44.asServiceRole.entities.ArticleSubmission.get(articleId);
    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    // EXTRACT content from uploaded file
    if (action === 'extract') {
      if (!article.file_url) {
        return Response.json({ error: 'No file to extract' }, { status: 400 });
      }

      const extracted = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
        file_url: article.file_url,
        json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string', description: 'Full article text in markdown' },
            summary: { type: 'string', description: 'Brief 2-3 sentence summary' }
          }
        }
      });

      const data = extracted.output || {};
      await base44.asServiceRole.entities.ArticleSubmission.update(articleId, {
        extracted_content: data.content || '',
        title: data.title || article.title
      });

      return Response.json({ success: true, extracted: data });
    }

    // APPROVE + generate social posts + optionally publish as blog
    if (action === 'approve') {
      const { platforms = [], publishAsBlog = true } = await req.json().catch(() => ({}));
      const content = article.extracted_content || '';

      // Generate social drafts for each platform
      const socialPostIds = [];
      for (const platform of platforms) {
        const platformGuidance = {
          linkedin: 'Professional tone, 150-250 words, 3-5 hashtags, end with a question. Max 3000 chars.',
          twitter: 'Punchy and bold, max 280 chars, 2-3 hashtags.',
          instagram: 'Engaging caption, 5-10 hashtags, visual language.'
        }[platform] || 'Professional tone.';

        const postContent = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Write a ${platform} social post for Asaad Morman (cybersecurity entrepreneur, TS/SCI, CEO of Emerging Defense Solutions) promoting this article:\n\nTitle: ${article.title}\n\nContent:\n${content.substring(0, 2000)}\n\nGuidelines: ${platformGuidance}\n\nReturn only the post text, no labels or explanation.`
        });

        const socialPost = await base44.asServiceRole.entities.SocialPost.create({
          platform,
          content: postContent,
          status: 'draft',
          source_type: 'blog',
          source_id: articleId,
          source_title: article.title
        });
        socialPostIds.push(socialPost.id);
      }

      // Optionally create/update a BlogPost
      let blogPostId = null;
      if (publishAsBlog && content) {
        const blogPost = await base44.asServiceRole.entities.BlogPost.create({
          title: article.title,
          content: content,
          excerpt: content.substring(0, 200).replace(/[#*]/g, '').trim() + '...',
          category: 'technical',
          published: false, // still needs manual publish
          featured: false,
          read_time: `${Math.ceil(content.split(' ').length / 200)} min read`,
          tags: ['cybersecurity', 'expert-insight']
        });
        blogPostId = blogPost.id;
      }

      await base44.asServiceRole.entities.ArticleSubmission.update(articleId, {
        status: 'approved',
        social_post_ids: socialPostIds
      });

      return Response.json({ success: true, socialPostIds, blogPostId });
    }

    // PUBLISH approved social posts to LinkedIn
    if (action === 'publish_linkedin') {
      const { postContent, socialPostId } = await req.json().catch(() => ({}));
      if (!postContent) {
        return Response.json({ error: 'postContent required' }, { status: 400 });
      }

      const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!profileRes.ok) {
        return Response.json({ error: 'Failed to fetch LinkedIn profile' }, { status: 500 });
      }
      const profile = await profileRes.json();
      const personUrn = `urn:li:person:${profile.sub}`;

      const shareRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: personUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: postContent },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
        })
      });

      if (!shareRes.ok) {
        const err = await shareRes.text();
        return Response.json({ error: `LinkedIn API error: ${err}` }, { status: 500 });
      }

      const shareData = await shareRes.json();

      if (socialPostId) {
        await base44.asServiceRole.entities.SocialPost.update(socialPostId, {
          status: 'published',
          published_at: new Date().toISOString(),
          platform_post_id: shareData.id
        });
      }

      return Response.json({ success: true, linkedInPostId: shareData.id });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});