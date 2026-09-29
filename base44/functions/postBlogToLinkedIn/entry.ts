import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { postContent, blogPostId } = await req.json();

    if (!postContent) {
      return Response.json({ error: 'postContent is required' }, { status: 400 });
    }

    // Get the LinkedIn access token via the shared connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // First, get the authenticated user's LinkedIn person URN
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
      return Response.json({ error: `LinkedIn API error: ${err}` }, { status: 500 });
    }

    const shareData = await shareRes.json();
    const linkedInPostId = shareData.id;

    // If a blogPostId was provided, update the SocialPost record
    if (blogPostId) {
      const socialPosts = await base44.asServiceRole.entities.SocialPost.filter({
        source_id: blogPostId,
        platform: 'linkedin'
      });
      if (socialPosts.length > 0) {
        await base44.asServiceRole.entities.SocialPost.update(socialPosts[0].id, {
          status: 'published',
          published_at: new Date().toISOString(),
          platform_post_id: linkedInPostId
        });
      }
    }

    return Response.json({ success: true, linkedInPostId });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});