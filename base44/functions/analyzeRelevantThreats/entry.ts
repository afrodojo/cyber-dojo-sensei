import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get recent threats
    const threats = await base44.entities.ThreatIntelligence.filter(
      { active: true },
      '-published_date',
      30
    );

    // Get application stack indicators (from blog posts, case studies, etc.)
    const [blogPosts, caseStudies] = await Promise.all([
      base44.entities.BlogPost.list('-created_date', 20),
      base44.entities.CaseStudy.list('-created_date', 20)
    ]);

    // Extract keywords related to tech stack and services
    const appKeywords = new Set([
      'nodejs', 'react', 'python', 'deno', 'typescript',
      'api', 'web', 'database', 'kubernetes', 'docker',
      'authentication', 'cybersecurity', 'penetration', 'red-team',
      'compliance', 'pci', 'hipaa', 'incident', 'response'
    ]);

    // Use LLM to analyze threat relevance
    const threatAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze these cybersecurity threats and identify which are most relevant to a cybersecurity consulting firm:

THREATS:
${threats.map(t => `- ${t.title} (${t.severity}): ${t.description}`).join('\n')}

STACK/SERVICES (from case studies and blog posts):
- Primary service: Red team operations, penetration testing, security consulting
- Tech stack: React/Node.js/TypeScript, web applications, APIs
- Compliance focus: HIPAA, PCI, incident response

For each threat, provide:
1. Relevance score (0-10)
2. Why it matters to this firm
3. Recommended action

Format as JSON array of objects with: { threat_title, relevance_score, impact, recommendation }`,
      response_json_schema: {
        type: 'object',
        properties: {
          analysis: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                threat_title: { type: 'string' },
                relevance_score: { type: 'number' },
                impact: { type: 'string' },
                recommendation: { type: 'string' }
              }
            }
          },
          critical_issues: { type: 'array', items: { type: 'string' } },
          summary: { type: 'string' }
        }
      }
    });

    // Flag high-relevance threats
    const flaggedThreats = threatAnalysis.analysis
      .filter(t => t.relevance_score >= 7)
      .sort((a, b) => b.relevance_score - a.relevance_score);

    return Response.json({
      status: 'success',
      total_threats_analyzed: threats.length,
      relevant_threats: flaggedThreats.length,
      critical_count: threatAnalysis.critical_issues?.length || 0,
      analysis: threadAnalysis,
      flagged_threats: flaggedThreats,
      summary: threatAnalysis.summary
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});