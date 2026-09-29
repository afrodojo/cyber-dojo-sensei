import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Validate API key for webhook authentication
    const authHeader = req.headers.get('authorization') || '';
    const expectedKey = Deno.env.get('GRANT_WEBHOOK_SECRET');
    
    if (!expectedKey || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const providedKey = authHeader.replace('Bearer ', '');
    if (providedKey !== expectedKey) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse JSON body
    let payload;
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    const required = ['title', 'provider', 'amount', 'deadline', 'application_url'];
    for (const field of required) {
      if (!payload[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate amount is a number
    if (typeof payload.amount !== 'number' || payload.amount < 0) {
      return new Response(
        JSON.stringify({ error: 'Amount must be a non-negative number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate deadline is a valid date
    const deadlineDate = new Date(payload.deadline);
    if (isNaN(deadlineDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid deadline date format (use YYYY-MM-DD)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate application_url is a URL
    try {
      new URL(payload.application_url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid application_url format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create base44 client with service role (no user auth needed for webhook)
    const base44 = createClientFromRequest(req);

    // Prepare grant data for database
    const grantData = {
      title: payload.title,
      provider: payload.provider,
      amount: payload.amount,
      deadline: payload.deadline,
      application_url: payload.application_url,
      description: payload.description || '',
      eligibility: Array.isArray(payload.eligibility) ? payload.eligibility : [],
      category: payload.category || 'other',
      is_active: true,
      source: 'ai_agent'
    };

    // Check if grant already exists (by title + deadline + provider to avoid duplicates)
    const existing = await base44.asServiceRole.entities.PhDGrant.filter({
      title: grantData.title,
      provider: grantData.provider,
      deadline: grantData.deadline
    }, null, 1);

    if (existing.length > 0) {
      // Update existing grant
      await base44.asServiceRole.entities.PhDGrant.update(existing[0].id, grantData);
      return Response.json({
        success: true,
        message: 'Grant updated successfully',
        grant_id: existing[0].id,
        action: 'updated'
      }, { status: 200 });
    } else {
      // Create new grant
      const created = await base44.asServiceRole.entities.PhDGrant.create(grantData);
      return Response.json({
        success: true,
        message: 'Grant created successfully',
        grant_id: created.id,
        action: 'created'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error processing grant:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});