import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const MASTER_ADMIN_EMAILS = [
  'cyberdojosensai@gmail.com',
  'cyberdojosensei@gmail.com'
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isMaster = MASTER_ADMIN_EMAILS.includes(user.email?.toLowerCase());

    if (isMaster && user.role !== 'admin') {
      // Persist admin role in the user database table using service role
      try {
        await base44.asServiceRole.entities.User.update(user.id, { role: 'admin' });
      } catch (updateErr) {
        console.error('Master admin DB update failed:', updateErr.message);
      }
      return Response.json({ master_admin: true, promoted: true, role: 'admin' });
    }

    return Response.json({
      master_admin: isMaster,
      promoted: false,
      role: user.role || 'user'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});