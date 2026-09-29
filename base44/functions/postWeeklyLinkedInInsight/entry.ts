import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const INSIGHTS = [
  `🔐 Security Insight of the Week:\n\nMost breaches aren't caused by sophisticated attacks — they're caused by misconfigured systems and unpatched software.\n\nDo a quick audit this week:\n✅ Review user access permissions\n✅ Patch any pending OS/software updates\n✅ Check for exposed admin panels\n\nSmall steps = massive risk reduction.\n\n#Cybersecurity #RedTeam #InfoSec #SecurityTips`,

  `⚠️ Security Insight of the Week:\n\nPhishing is still the #1 initial access vector for ransomware attacks in 2025.\n\nTrain your team to:\n🎯 Verify sender email domains carefully\n🎯 Never click links — go directly to sites\n🎯 Report suspicious emails immediately\n\nYour people are your first firewall.\n\n#Cybersecurity #PhishingAwareness #SecurityTraining #CyberDefense`,

  `🛡️ Security Insight of the Week:\n\nMFA (Multi-Factor Authentication) blocks over 99% of automated account attacks.\n\nIf you're not enforcing MFA across your org in 2025, you're leaving the door wide open.\n\nPriority list:\n1️⃣ Email / Microsoft 365 / Google Workspace\n2️⃣ VPN & remote access\n3️⃣ Admin & privileged accounts\n\nEnable it today. No excuses.\n\n#MFA #ZeroTrust #Cybersecurity #IdentitySecurity`,

  `🔍 Security Insight of the Week:\n\nThreat actors dwell inside networks an average of 16 days before being detected.\n\n16 days of undetected access = stolen credentials, exfiltrated data, and planted backdoors.\n\nAsk yourself:\n• Do you have a SIEM or centralized logging?\n• Are you monitoring for lateral movement?\n• When did you last review your detection rules?\n\nDetection speed is survival.\n\n#ThreatDetection #BlueTeam #SIEM #Cybersecurity`,

  `💡 Security Insight of the Week:\n\nZero Trust is not a product — it's a mindset.\n\n"Never trust, always verify" means:\n✔️ Every user, device, and request is authenticated\n✔️ Least-privilege access for everyone\n✔️ Continuous monitoring, not one-time checks\n\nStart small: segment your network and enforce least privilege on admin accounts this week.\n\n#ZeroTrust #CyberSecurity #NetworkSecurity #EnterpriseSecurity`,

  `🚨 Security Insight of the Week:\n\nSupply chain attacks are surging. Your vendors are your attack surface.\n\nBefore onboarding any third-party tool or vendor:\n🔎 Request their SOC 2 or ISO 27001 report\n🔎 Review their data access requirements\n🔎 Include security clauses in your contracts\n\nYour security is only as strong as your weakest partner.\n\n#SupplyChainSecurity #ThirdPartyRisk #Cybersecurity #RiskManagement`,

  `🧠 Security Insight of the Week:\n\nRed teaming isn't just about finding vulnerabilities — it's about testing your RESPONSE.\n\nA great red team engagement answers:\n• Can your SOC detect us?\n• How fast do they respond?\n• What happens if initial detection fails?\n\nOffensive security makes defensive security stronger. That's the mission.\n\n#RedTeam #OffensiveSecurity #PenTest #Cybersecurity #CyberDojo`,

  `🏗️ Security Insight of the Week:\n\nSecurity by design — not an afterthought.\n\nEvery time security is bolted on after development, it costs 6x more to fix than if it was built in from the start (IBM study).\n\nChampion these practices:\n• Threat modeling during design phase\n• Secure code review before deployment\n• Automated SAST/DAST in your CI/CD pipeline\n\nSecurity is an engineering discipline.\n\n#DevSecOps #SecureByDesign #AppSec #Cybersecurity`
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Require admin authentication
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
    }

    // Get the LinkedIn access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("linkedin");

    // Get the LinkedIn user profile (to get the person URN)
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    // Pick insight based on week number so it rotates through them
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const insight = INSIGHTS[weekNumber % INSIGHTS.length];

    // Post to LinkedIn
    const postRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify({
        author: personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: insight },
            shareMediaCategory: "NONE"
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
      })
    });

    const postData = await postRes.json();

    if (!postRes.ok) {
      return Response.json({ error: "LinkedIn API error", details: postData }, { status: 500 });
    }

    // Log the post to SocialPost entity
    await base44.asServiceRole.entities.SocialPost.create({
      platform: "linkedin",
      content: insight,
      status: "published",
      source_type: "manual",
      source_title: "Weekly Security Insight",
      published_at: new Date().toISOString(),
      platform_post_id: postData.id || ""
    });

    return Response.json({ success: true, post_id: postData.id, insight });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});