import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all published posts with platform IDs
    const posts = await base44.asServiceRole.entities.SocialPost.filter({ status: 'published' });
    const linkedInPosts = posts.filter(p => p.platform === 'linkedin' && p.platform_post_id);
    const instagramPosts = posts.filter(p => p.platform === 'instagram' && p.platform_post_id);

    let updated = 0;

    // --- LinkedIn metrics ---
    if (linkedInPosts.length > 0) {
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

        for (const post of linkedInPosts) {
          // LinkedIn Social Actions API for likes/comments/shares
          const shareId = post.platform_post_id; // urn:li:share:xxx
          const encoded = encodeURIComponent(shareId);

          const [socialRes, statsRes] = await Promise.all([
            fetch(`https://api.linkedin.com/v2/socialActions/${encoded}?projection=(likesSummary,commentsSummary,shareSummary)`, {
              headers: { Authorization: `Bearer ${accessToken}`, 'LinkedIn-Version': '202304' }
            }),
            fetch(`https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&shares[0]=${encoded}`, {
              headers: { Authorization: `Bearer ${accessToken}`, 'LinkedIn-Version': '202304' }
            })
          ]);

          const social = await socialRes.json();
          const stats = await statsRes.json();

          const likes = social?.likesSummary?.totalLikes ?? 0;
          const comments = social?.commentsSummary?.totalFirstLevelComments ?? 0;
          const shares = social?.shareSummary?.shareCount ?? 0;
          const clicks = stats?.elements?.[0]?.totalShareStatistics?.clickCount ?? 0;
          const impressions = stats?.elements?.[0]?.totalShareStatistics?.impressionCount ?? 0;

          await base44.asServiceRole.entities.SocialPost.update(post.id, {
            likes, comments, shares, clicks, impressions,
            metrics_updated_at: new Date().toISOString()
          });
          updated++;
        }
      } catch (e) {
        console.error('LinkedIn metrics error:', e.message);
      }
    }

    // --- Instagram metrics ---
    if (instagramPosts.length > 0) {
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

        for (const post of instagramPosts) {
          const mediaId = post.platform_post_id;
          const insightsRes = await fetch(
            `https://graph.instagram.com/${mediaId}/insights?metric=impressions,reach,likes_count,comments_count,shares,saved&access_token=${accessToken}`
          );
          const insights = await insightsRes.json();

          if (insights?.data) {
            const get = (name) => insights.data.find(m => m.name === name)?.values?.[0]?.value ?? insights.data.find(m => m.name === name)?.value ?? 0;
            await base44.asServiceRole.entities.SocialPost.update(post.id, {
              likes: get('likes_count'),
              comments: get('comments_count'),
              shares: get('shares'),
              impressions: get('impressions'),
              metrics_updated_at: new Date().toISOString()
            });
            updated++;
          }
        }
      } catch (e) {
        console.error('Instagram metrics error:', e.message);
      }
    }

    return Response.json({ success: true, updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});