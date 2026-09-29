import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const threats = [];
    const existingThreats = await base44.entities.ThreatIntelligence.list('-published_date', 100);
    const existingIds = new Set(existingThreats.map(t => t.title));

    // Fetch from CISA Cybersecurity Advisories (public endpoint)
    try {
      const cisaResponse = await fetch('https://api.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10');
      if (cisaResponse.ok) {
        const data = await cisaResponse.json();
        
        if (data.vulnerabilities) {
          for (const vuln of data.vulnerabilities.slice(0, 10)) {
            const cveId = vuln.cve?.id;
            const description = vuln.cve?.descriptions?.[0]?.value || 'N/A';
            const metrics = vuln.cve?.metrics?.cvssMetricV31?.[0];
            const cvssScore = metrics?.cvssData?.baseScore || 0;
            
            if (cveId && !existingIds.has(cveId)) {
              threats.push({
                title: cveId,
                description: description.substring(0, 500),
                severity: cvssScore >= 9 ? 'critical' : cvssScore >= 7 ? 'high' : cvssScore >= 4 ? 'medium' : 'low',
                category: 'vulnerability',
                source: 'NIST NVD',
                published_date: new Date().toISOString().split('T')[0],
                active: true,
                mitigation_steps: [
                  'Monitor official vendor security advisories',
                  'Check if your stack uses affected software',
                  'Apply patches when available',
                  `CVSS Score: ${cvssScore}`
                ]
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('NIST NVD fetch failed:', e);
    }

    // Fetch from GreyNoise API (if key available)
    try {
      const greynoiseKey = Deno.env.get('GREYNOISE_API_KEY');
      if (greynoiseKey) {
        const response = await fetch('https://api.greynoise.io/v3/query/tag?tag=ransomware&limit=10', {
          headers: { 'key': greynoiseKey }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            for (const threat of data.data) {
              if (!existingIds.has(threat.ip || threat.name)) {
                threats.push({
                  title: `GreyNoise: ${threat.name || threat.ip}`,
                  description: threat.classification || 'Suspected malicious activity',
                  severity: threat.seen_in_the_wild ? 'high' : 'medium',
                  category: 'apt',
                  source: 'GreyNoise',
                  published_date: new Date().toISOString().split('T')[0],
                  active: true,
                  mitigation_steps: [
                    'Block IP/domain at firewall',
                    'Monitor for connections attempts',
                    'Review logs for suspicious activity',
                    'Update threat intelligence feeds'
                  ]
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('GreyNoise fetch failed:', e);
    }

    // Fetch from SecurityNews API (free endpoint)
    try {
      const newsApiKey = Deno.env.get('NEWSAPI_API_KEY') || 'demo';
      const response = await fetch(`https://newsapi.org/v2/everything?q=cybersecurity+vulnerability&language=en&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.articles) {
          for (const article of data.articles.slice(0, 5)) {
            const title = article.title.substring(0, 100);
            if (!existingIds.has(title)) {
              threats.push({
                title: title,
                description: article.description || article.content || 'Security news update',
                severity: 'medium',
                category: 'threat-intelligence',
                source: 'Security News',
                published_date: new Date(article.publishedAt).toISOString().split('T')[0],
                active: true,
                mitigation_steps: [
                  'Review full article for impact analysis',
                  'Assess if applicable to your infrastructure',
                  'Update security team with relevant information'
                ]
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('News fetch failed:', e);
    }

    // Save new threats
    let saved = 0;
    for (const threat of threats) {
      try {
        await base44.entities.ThreatIntelligence.create(threat);
        saved++;
      } catch (e) {
        console.error('Failed to save threat:', e);
      }
    }

    return Response.json({
      status: 'success',
      fetched_sources: 3,
      new_threats_found: threats.length,
      threats_saved: saved,
      threats: threats.map(t => ({ title: t.title, severity: t.severity, source: t.source }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});