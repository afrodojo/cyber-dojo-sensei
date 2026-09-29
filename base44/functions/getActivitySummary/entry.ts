import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

/**
 * Hub-Ready: getActivitySummary
 * Returns app-context-aware activity metrics for the PHD Hub ecosystem.
 * - ASOSINT context: count of active investigations
 * - CyberDojoSensai context: count of total active users
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const appContext = body.app_context || 'CyberDojoSensai';

    if (appContext === 'ASOSINT') {
      // Return count of active investigations (SecurityAssessments with active/in-progress status)
      const investigations = await base44.asServiceRole.entities.SecurityAssessment.filter({
        status: 'in-progress'
      });
      
      return Response.json({
        app_context: 'ASOSINT',
        metric: 'active_investigations',
        count: investigations.length,
        label: 'Active Investigations',
        hub_ready: true,
        timestamp: new Date().toISOString()
      });

    } else {
      // CyberDojoSensai context: count total active users
      const users = await base44.asServiceRole.entities.User.list();
      
      return Response.json({
        app_context: 'CyberDojoSensai',
        metric: 'total_active_users',
        count: users.length,
        label: 'Total Active Users',
        hub_ready: true,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});