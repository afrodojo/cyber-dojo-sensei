import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let isScheduled = false;
    try {
      const body = await req.clone().json().catch(() => ({}));
      isScheduled = !!body?.automation;
    } catch (_) {}

    if (!isScheduled) {
      const user = await base44.auth.me().catch(() => null);
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    const socialPosts = await base44.asServiceRole.entities.SocialPost.filter({
      platform: 'linkedin',
      status: 'published'
    });

    if (socialPosts.length === 0) {
      return Response.json({
        success: true,
        message: 'No published LinkedIn posts found',
        postsProcessed: 0,
        commentsFound: 0,
        repliesPosted: 0,
        details: []
      });
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

    const engaged = await base44.asServiceRole.entities.LinkedInEngagement.list('-created_date', 500);
    const engagedUrnSet = new Set(engaged.map(e => e.comment_urn).filter(Boolean));

    let totalComments = 0;
    let repliesPosted = 0;
    const details = [];

    for (const post of socialPosts) {
      if (!post.platform_post_id) continue;

      const postUrn = post.platform_post_id.startsWith('urn:')
        ? post.platform_post_id
        : `urn:li:ugcPost:${post.platform_post_id}`;

      let comments = [];
      try {
        const commentsRes = await fetch(
          `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/comments?count=50`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'X-Restli-Protocol-Version': '2.0.0'
            }
          }
        );

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          comments = commentsData.elements || [];
        } else {
          const errText = await commentsRes.text();
          details.push({
            post: postUrn,
            error: `Comment fetch failed (${commentsRes.status}): ${errText.substring(0, 200)}`
          });
          continue;
        }
      } catch (e) {
        details.push({ post: postUrn, error: `Comment fetch error: ${e.message}` });
        continue;
      }

      totalComments += comments.length;

      for (const comment of comments) {
        const commentUrn = comment.$id || comment.urn || '';

        if (engagedUrnSet.has(commentUrn)) continue;

        const commenterUrn = comment.actor || '';
        if (commenterUrn === personUrn) continue;

        const commentText = comment.message?.text || '';
        const commenterName = comment.actorInfo?.name?.localized?.en_US ||
                              comment.authorInfo?.name?.localized?.en_US ||
                              'a reader';

        let replyText = '';
        try {
          const replyResult = await base44.integrations.Core.InvokeLLM({
            prompt: `You are a cybersecurity professional and thought leader. Someone commented on your LinkedIn post. Write a thoughtful, professional, and concise reply (1-3 sentences) that adds value and encourages discussion. Output only the reply text, no quotes or labels.\n\nPost context: ${post.content || post.title || ''}\n\nCommenter: ${commenterName}\nComment: "${commentText}"`,
            response_json_schema: {
              type: "object",
              properties: {
                reply: { type: "string" }
              }
            }
          });
          replyText = replyResult.reply || '';
        } catch (e) {
          replyText = `Thank you for your comment, ${commenterName.split(' ')[0]}! Great point — appreciate you sharing your perspective.`;
        }

        if (!replyText) continue;

        let replyStatus = 'replied';
        let errorMessage = '';
        try {
          const replyRes = await fetch(
            `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/comments`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0',
                'X-Restli-Method': 'create'
              },
              body: JSON.stringify({
                actor: personUrn,
                object: postUrn,
                message: { text: replyText }
              })
            }
          );

          if (!replyRes.ok) {
            const err = await replyRes.text();
            replyStatus = 'failed';
            errorMessage = err.substring(0, 300);
          } else {
            repliesPosted++;
          }
        } catch (e) {
          replyStatus = 'failed';
          errorMessage = e.message;
        }

        await base44.asServiceRole.entities.LinkedInEngagement.create({
          post_id: post.id,
          post_urn: postUrn,
          comment_urn: commentUrn,
          commenter_name: commenterName,
          commenter_urn: commenterUrn,
          comment_text: commentText,
          reply_text: replyText,
          status: replyStatus,
          error_message: errorMessage,
          engaged_at: new Date().toISOString()
        });

        details.push({
          post: postUrn,
          commenter: commenterName,
          comment: commentText.substring(0, 150),
          reply: replyText.substring(0, 150),
          status: replyStatus
        });
      }
    }

    return Response.json({
      success: true,
      postsProcessed: socialPosts.length,
      commentsFound: totalComments,
      repliesPosted,
      details
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});