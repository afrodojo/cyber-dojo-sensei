import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate career transition advice using AI
    const advice = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Write a compelling LinkedIn post from Asaad Morman — cybersecurity entrepreneur, TS/SCI-cleared US Marine Veteran, Founder & CEO of Emerging Defense Solutions — sharing actionable cybersecurity career transition advice for military veterans and professionals pivoting into cybersecurity.

Requirements:
- Personal, authentic voice from a Marine veteran who made the transition
- Include 2-3 concrete, actionable tips (certifications, mindset, networking, etc.)
- 200-250 words
- Professional but relatable tone
- End with an engaging question to encourage comments
- Include 4-5 relevant hashtags like #CybersecurityCareers #MilitaryTransition #VeteranInTech #CyberSecurity #CareerAdvice
- Do NOT use hollow phrases like "game-changer" or "excited to share"`,
    });

    // Get LinkedIn access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // Get LinkedIn profile URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    // Post to LinkedIn
    const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: advice },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }),
    });

    if (!postRes.ok) {
      const err = await postRes.text();
      return Response.json({ error: `LinkedIn post failed: ${err}` }, { status: 500 });
    }

    return Response.json({ success: true, content: advice });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});