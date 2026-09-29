import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Search the web for recent PhD grants and fellowships
    const searchResults = await base44.integrations.Core.InvokeLLM({
      prompt: `Search and discover the most current PhD and doctoral funding opportunities from 2024-2026. 
      
Focus on:
- NSF Graduate Research Fellowships
- NIH Ruth L. Kirschstein NRSA Fellowships  
- Department of Defense NDSEG Fellowships
- Fulbright Scholarships for Doctoral Research
- Spencer Foundation Research Grants
- Ford Foundation Predoctoral Fellowships
- Recent private foundation grants for STEM/CyberSecurity
- Government defense/intelligence agency doctoral opportunities

For EACH opportunity found, provide ONLY valid, active grants with REAL application URLs.

Return as a JSON array with this exact structure (no extra text):
[
  {
    "title": "Grant Name",
    "provider": "Funding Agency Name",
    "amount": "Dollar amount or 'Fully Funded'",
    "deadline": "YYYY-MM-DD",
    "description": "1-2 sentence summary of scope and focus area",
    "eligibility": "Core requirements (citizenship, degree level, field restrictions)",
    "application_url": "Direct official application link (must be real and working)"
  }
]

CRITICAL: Only include grants that are:
1. Currently accepting applications (deadline has not passed)
2. Have verifiable, real application URLs (not placeholders)
3. Specifically for PhD/doctoral level study
4. Updated or active in 2024-2026`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          grants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                provider: { type: 'string' },
                amount: { type: 'string' },
                deadline: { type: 'string' },
                description: { type: 'string' },
                eligibility: { type: 'string' },
                application_url: { type: 'string' }
              },
              required: ['title', 'provider', 'amount', 'deadline', 'description', 'eligibility', 'application_url']
            }
          }
        }
      }
    });

    // Extract grants from response
    const grants = Array.isArray(searchResults) ? searchResults : searchResults.grants || [];
    
    if (!grants || grants.length === 0) {
      return Response.json({
        success: true,
        grants_discovered: 0,
        message: 'No new grants found in this discovery cycle'
      });
    }

    // Validate and normalize grant data
    const validGrants = grants.filter(grant => {
      return grant.title && grant.provider && grant.deadline && grant.application_url &&
             /^\d{4}-\d{2}-\d{2}$/.test(grant.deadline) && // Valid date format
             (grant.application_url.startsWith('http://') || grant.application_url.startsWith('https://'));
    });

    // Submit each grant to the endpoint
    const webhookSecret = Deno.env.get('GRANT_WEBHOOK_SECRET');
    const appUrl = Deno.env.get('BASE44_APP_URL') || 'https://cyberdojosensei.eds-360.com';
    const submitUrl = `${appUrl}/api/v1/grants/announcement`;

    let submitted = 0;
    let failed = 0;
    const submissionResults = [];

    for (const grant of validGrants) {
      try {
        // Normalize deadline to Date format
        const deadline = grant.deadline;
        
        const payload = {
          title: grant.title,
          provider: grant.provider,
          amount: parseFloat(grant.amount.replace(/[$,]/g, '')) || 0,
          deadline: deadline,
          description: grant.description || '',
          eligibility: Array.isArray(grant.eligibility) 
            ? grant.eligibility 
            : [grant.eligibility || ''],
          application_url: grant.application_url,
          category: 'research', // Default category
          is_active: true,
          source: 'ai_agent'
        };

        const headers = {
          'Content-Type': 'application/json',
        };

        // Add webhook authentication if secret is configured
        if (webhookSecret) {
          headers['Authorization'] = `Bearer ${webhookSecret}`;
        }

        const response = await fetch(submitUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          submitted++;
          submissionResults.push({
            title: grant.title,
            status: 'submitted',
            provider: grant.provider,
            deadline: deadline
          });
        } else {
          failed++;
          submissionResults.push({
            title: grant.title,
            status: 'failed',
            error: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        failed++;
        submissionResults.push({
          title: grant.title,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log(`[GRANT DISCOVERY] Found: ${validGrants.length}, Submitted: ${submitted}, Failed: ${failed}`);

    return Response.json({
      success: true,
      grants_discovered: validGrants.length,
      grants_submitted: submitted,
      grants_failed: failed,
      submission_results: submissionResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Autonomous grant discovery error:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});