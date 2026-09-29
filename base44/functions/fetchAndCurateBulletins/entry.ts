import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled (no auth) or admin-triggered calls
    let isAuthorized = false;
    try {
      const user = await base44.auth.me();
      if (user?.role === 'admin') isAuthorized = true;
    } catch (_) {
      // scheduled call - allow via service role
      isAuthorized = true;
    }
    if (!isAuthorized) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const sectors = [
      { sector: 'general', query: 'latest CISA cybersecurity alerts advisories 2025 2026' },
      { sector: 'general', query: 'Shodan Censys threat intelligence zero-day exploits public CVE 2025 2026' },
      { sector: 'general', query: 'ENISA European Union cybersecurity threats international advisory 2025 2026' },
      { sector: 'general', query: 'international cybersecurity threats Asia Pacific APAC CERT 2025 2026' },
      { sector: 'education', query: 'cybersecurity threats higher education K12 schools ransomware 2025 2026' },
      { sector: 'finance', query: 'financial sector cyber threats FinCEN treasury cybersecurity advisory 2025 2026' },
      { sector: 'finance', query: 'banking malware financial cybercrime threats international 2025 2026' },
      { sector: 'healthcare', query: 'healthcare cybersecurity HHS HIPAA threats hospital ransomware 2025 2026' },
      { sector: 'healthcare', query: 'medical device vulnerability healthcare cyber attacks 2025 2026' },
      { sector: 'physical-security', query: 'physical security best practices active shooter critical infrastructure 2025 2026' },
      { sector: 'critical-infrastructure', query: 'critical infrastructure SCADA ICS attacks power grid water 2025 2026' },
      { sector: 'defense', query: 'DoD defense cybersecurity CMMC NIST threats advisory 2025 2026' },
      { sector: 'defense', query: 'APT advanced persistent threat groups cyber espionage nation state 2025 2026' }
    ];

    const results = [];

    for (const { sector, query } of sectors) {
      const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a cybersecurity intelligence curator. Search for the 2 most recent and important public cybersecurity bulletins, advisories, or best practice guides relevant to: "${sector}" sector. Query: "${query}". 
        
For each bulletin found, provide accurate information pulled from real public sources (CISA, FBI, NSA, DHS, HHS, FinCEN, DoD, NIST, etc.).

Return exactly 2 bulletins as a JSON array.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            bulletins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  content: { type: "string" },
                  category: { type: "string", enum: ["advisory", "bulletin", "best-practice", "threat-alert", "guidance", "training"] },
                  threat_level: { type: "string", enum: ["info", "low", "medium", "high", "critical"] },
                  source: { type: "string" },
                  source_url: { type: "string" },
                  published_date: { type: "string" },
                  key_actions: { type: "array", items: { type: "string" } },
                  tags: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      if (response?.bulletins) {
        for (const bulletin of response.bulletins) {
          // Check for duplicate by title
          const existing = await base44.asServiceRole.entities.CyberBulletin.filter({ title: bulletin.title });
          if (existing.length === 0) {
            const created = await base44.asServiceRole.entities.CyberBulletin.create({
              ...bulletin,
              sector,
              is_published: true
            });
            results.push(created);
          }
        }
      }
    }

    return Response.json({ success: true, created: results.length, message: `Added ${results.length} new bulletins` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});