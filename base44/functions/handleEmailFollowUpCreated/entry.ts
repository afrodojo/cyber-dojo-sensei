import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    
    const { event, data } = payload;

    // Only process creates
    if (event.type !== 'create') {
      return Response.json({ status: 'skipped' });
    }

    const emailFollowUp = data;

    // Only sync if status is 'sent'
    if (emailFollowUp.status !== 'sent') {
      return Response.json({ status: 'skipped', reason: 'Email not sent' });
    }

    // Get active CRM configs
    const crmConfigs = await base44.asServiceRole.entities.CRMConfig.filter({ 
      is_connected: true,
      push_email_metrics: true
    });

    for (const config of crmConfigs) {
      try {
        // Sync email metrics to CRM
        await base44.asServiceRole.functions.invoke('syncEmailMetricsToCRM', {
          emailFollowUpId: emailFollowUp.id,
          crmSystem: config.crm_system
        });
      } catch (error) {
        console.error(`Failed to sync email to ${config.crm_system}:`, error);
      }
    }

    return Response.json({ success: true, synced: crmConfigs.length });
  } catch (error) {
    console.error('Email follow-up handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});