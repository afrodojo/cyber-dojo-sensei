import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Entity automation payload: { event, data, old_data, changed_fields }
    const post = body.data;
    if (!post) {
      return Response.json({ error: 'No blog post data in payload' }, { status: 400 });
    }

    // Skip if not actually published (safety check — automation conditions should filter this too)
    if (post.status !== 'published') {
      return Response.json({ success: true, message: 'Post not published, skipping' });
    }

    // Build the LinkedIn post content: title, excerpt summary, and link
    const postUrl = `${Deno.env.get('BASE44_APP_URL') || ''}/BlogPostDetail?id=${post.id}`;
    const excerpt = post.excerpt ? post.excerpt.trim() : '';

    const lines = [
      `🛡️ ${post.title}`,
      '',
    ];
    if (excerpt) {
      lines.push(excerpt, '');
    }
    lines.push(`Read the full article: ${postUrl}`);

    const postContent = lines.join('\n');

    // Get the LinkedIn access token via the shared connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // Get the authenticated user's LinkedIn person URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!profileRes.ok) {
      const err = await profileRes.text();
      return Response.json({ error: `Failed to fetch LinkedIn profile: ${err}` }, { status: 500 });
    }

    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    // Post the share to LinkedIn
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
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    if (!shareRes.ok) {
      const err = await shareRes.text();
      // Log failure to a SocialPost record if one exists
      const existing = await base44.asServiceRole.entities.SocialPost.filter({
        source_id: post.id, platform: 'linkedin'
      });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.SocialPost.update(existing[0].id, {
          status: 'failed',
          error_message: err.slice(0, 500)
        });
      }
      return Response.json({ error: `LinkedIn API error: ${err}` }, { status: 500 });
    }

    const shareData = await shareRes.json();
    const linkedInPostId = shareData.id;

    // Create or update a SocialPost record to track this share
    const existing = await base44.asServiceRole.entities.SocialPost.filter({
      source_id: post.id, platform: 'linkedin'
    });

    if (existing.length > 0) {
      await base44.asServiceRole.entities.SocialPost.update(existing[0].id, {
        content: postContent,
        status: 'published',
        published_at: new Date().toISOString(),
        platform_post_id: linkedInPostId,
        source_title: post.title,
        error_message: null
      });
    } else {
      await base44.asServiceRole.entities.SocialPost.create({
        platform: 'linkedin',
        content: postContent,
        status: 'published',
        source_type: 'blog',
        source_id: post.id,
        source_title: post.title,
        published_at: new Date().toISOString(),
        platform_post_id: linkedInPostId
      });
    }

    return Response.json({
      success: true,
      linkedInPostId,
      blogPostId: post.id,
      title: post.title
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});