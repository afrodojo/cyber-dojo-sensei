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

    const lead = data;
    const oldLead = old_data;

    // Check if status changed
    if (lead.status === oldLead.status) {
      return Response.json({ status: 'skipped', reason: 'Status unchanged' });
    }

    // Get active CRM configs
    const crmConfigs = await base44.asServiceRole.entities.CRMConfig.filter({ is_connected: true });

    for (const config of crmConfigs) {
      try {
        // Push status update to CRM
        await base44.asServiceRole.functions.invoke('syncLeadStatusToCRM', {
          leadId: lead.id,
          leadEmail: lead.email,
          newStatus: lead.status,
          crmSystem: config.crm_system
        });
      } catch (error) {
        console.error(`Failed to sync lead status to ${config.crm_system}:`, error);
      }
    }

    return Response.json({ success: true, synced: crmConfigs.length });
  } catch (error) {
    console.error('Lead status change handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});