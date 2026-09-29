import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Require admin authentication
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
    }

    // Get Instagram access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("instagram");

    // Step 1: Get Instagram user ID
    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const me = await meRes.json();
    if (!me.id) {
      return Response.json({ error: "Could not get Instagram user ID", details: me }, { status: 500 });
    }
    const igUserId = me.id;

    // Step 2: Generate a cybersecurity tip via AI
    const tip = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Generate a single compelling cybersecurity tip post for Instagram by Asaad Morman (cybersecurity expert, Marine veteran, CEO of Emerging Defense Solutions).

Requirements:
- 150-200 characters of core tip text
- Actionable and educational
- Professional but accessible tone
- End with 5-7 relevant hashtags like #Cybersecurity #InfoSec #CyberTip #DataProtection #SecurityAwareness
- Do NOT include any markdown, just plain text
- Make it feel like a daily tip series

Return ONLY the post text, nothing else.`
    });

    // Step 3: Generate an image for the post
    const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: `Professional cybersecurity tip graphic for Instagram. Dark navy blue background with cyan/blue accent colors. Clean modern design with a shield icon or lock icon. Include subtle circuit board or digital patterns. Text overlay area in center. Professional, corporate feel. 1:1 square format, 1080x1080px style.`
    });

    const imageUrl = imageResult.url;

    // Step 4: Create a media container (photo post)
    const containerRes = await fetch(`https://graph.instagram.com/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: tip,
        access_token: accessToken
      })
    });
    const container = await containerRes.json();

    if (!container.id) {
      return Response.json({ error: "Failed to create media container", details: container }, { status: 500 });
    }

    // Step 5: Publish the container
    const publishRes = await fetch(`https://graph.instagram.com/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: accessToken
      })
    });
    const published = await publishRes.json();

    if (!published.id) {
      return Response.json({ error: "Failed to publish media", details: published }, { status: 500 });
    }

    // Step 6: Save to SocialPost entity for tracking
    await base44.asServiceRole.entities.SocialPost.create({
      platform: "instagram",
      content: tip,
      status: "published",
      source_type: "manual",
      source_title: "Daily Cyber Tip",
      published_at: new Date().toISOString(),
      platform_post_id: published.id
    });

    return Response.json({ success: true, postId: published.id, caption: tip });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});