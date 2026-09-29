import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Require admin authentication
    let user;
    try {
      user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
      }
    } catch (e) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const {
      violation_type,
      source_ip,
      user_agent,
      endpoint,
      session_id,
      description,
      severity = 'medium',
      request_pattern = {}
    } = await req.json();

    if (!violation_type || !description) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Log violation to database using service role
    const violationLog = await base44.asServiceRole.entities.SecurityViolationLog.create({
      violation_type,
      severity,
      source_ip: source_ip || 'unknown',
      user_agent: user_agent || 'unknown',
      session_id: session_id || 'unknown',
      endpoint: endpoint || 'unknown',
      description,
      request_pattern: JSON.stringify(request_pattern),
      action_taken: 'logged',
      status: 'open'
    });

    // Determine action based on severity and violation type
    let action = 'logged';
    if (severity === 'critical') {
      action = 'blocked';
      // In production, would trigger IP blocking here
    } else if (severity === 'high') {
      action = 'rate_limited';
      // In production, would implement rate limiting
    }

    // Update violation with action taken
    await base44.asServiceRole.entities.SecurityViolationLog.update(violationLog.id, {
      action_taken: action
    });

    // Log to console for immediate visibility
    console.log(`[SECURITY VIOLATION] Type: ${violation_type} | Severity: ${severity} | IP: ${source_ip} | Action: ${action}`);

    return Response.json({
      success: true,
      violation_id: violationLog.id,
      action_taken: action,
      message: `Security violation logged and ${action} initiated`
    });
  } catch (error) {
    console.error('Security monitoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});