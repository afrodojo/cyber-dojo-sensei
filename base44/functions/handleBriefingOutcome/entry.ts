import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    
    const { event, data, old_data } = payload;

    // Only process updates
    if (event.type !== 'update') {
      return Response.json({ status: 'skipped' });
    }

    const briefing = data;
    const oldBriefing = old_data;

    // Check if status changed to a completed state
    const completedStates = ['qualified', 'next_steps_defined', 'proposal_pending', 'won', 'lost'];
    if (!completedStates.includes(briefing.status) || briefing.status === oldBriefing.status) {
      return Response.json({ status: 'skipped', reason: 'No outcome change' });
    }

    // Get active CRM configs
    const crmConfigs = await base44.asServiceRole.entities.CRMConfig.filter({ 
      is_connected: true,
      push_briefing_outcomes: true
    });

    for (const config of crmConfigs) {
      try {
        // Sync briefing outcome to CRM
        await base44.asServiceRole.functions.invoke('syncBriefingOutcomesToCRM', {
          executiveBriefingId: briefing.id,
          crmSystem: config.crm_system,
          outcome: briefing.status
        });
      } catch (error) {
        console.error(`Failed to sync briefing outcome to ${config.crm_system}:`, error);
      }
    }

    return Response.json({ success: true, synced: crmConfigs.length });
  } catch (error) {
    console.error('Briefing outcome handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});