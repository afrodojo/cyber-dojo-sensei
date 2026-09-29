import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin-only trigger
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch active subscribers
    const subscribers = await base44.asServiceRole.entities.Subscriber.filter({ active: true });
    // Fetch active grants
    const grants = await base44.asServiceRole.entities.PhDGrant.filter({ is_active: true });
    // Fetch active courses created/updated in the last 7 days
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const courses = await base44.asServiceRole.entities.Course.filter({ is_active: true }, "display_order", 50);

    const upcomingGrants = grants
      .filter(g => g.deadline && new Date(g.deadline) >= today)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);

    const newCourses = courses.filter(c => {
      const created = c.created_date ? new Date(c.created_date) : null;
      return created && created >= weekAgo;
    }).slice(0, 5);

    let sentCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      const firstName = sub.name?.split(' ')[0] || 'there';
      const grantHtml = upcomingGrants.length > 0
        ? upcomingGrants.map(g => {
            const days = Math.ceil((new Date(g.deadline) - today) / (1000 * 60 * 60 * 24));
            return `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid #1e293b;">
                <a href="${g.application_url || '#'}" style="color:#06b6d4;text-decoration:none;font-weight:600;">${g.title}</a>
              </td>
              <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:13px;">${g.provider || '—'}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #1e293b;text-align:right;">
                <span style="color:${days <= 7 ? '#ef4444' : days <= 30 ? '#eab308' : '#06b6d4'};font-weight:700;font-size:13px;">
                  ${days === 0 ? 'Today' : `${days}d left`}
                </span>
              </td>
            </tr>`;
          }).join('')
        : '<tr><td colspan="3" style="padding:16px;text-align:center;color:#64748b;">No upcoming grant deadlines this week.</td></tr>';

      const courseHtml = newCourses.length > 0
        ? newCourses.map(c => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #1e293b;">
              <span style="color:#e2e8f0;font-weight:500;">${c.title}</span>
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:13px;">${c.category}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #1e293b;text-align:right;color:#06b6d4;font-weight:700;font-size:13px;">
              ${c.price_label || '$' + (c.price || 0).toLocaleString()}
            </td>
          </tr>`).join('')
        : '<tr><td colspan="3" style="padding:16px;text-align:center;color:#64748b;">No new courses added this week.</td></tr>';

      const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#06b6d4,#3b82f6);border-radius:12px;line-height:48px;font-size:24px;margin-bottom:16px;">🥷</div>
      <h1 style="color:#f1f5f9;font-size:24px;margin:0 0 8px;">Cyber Dojo Weekly Digest</h1>
      <p style="color:#64748b;font-size:14px;margin:0;">${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    </div>

    <p style="color:#cbd5e1;font-size:15px;line-height:1.6;">Hi ${firstName},</p>
    <p style="color:#94a3b8;font-size:14px;line-height:1.6;">Here's your weekly roundup of upcoming grant deadlines and new training opportunities from Asaad Morman's Cyber Dojo.</p>

    <!-- Grants Section -->
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
      <h2 style="color:#06b6d4;font-size:16px;margin:0 0 12px;display:flex;align-items:center;gap:8px;">🎓 Upcoming Grant Deadlines</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">
            <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #334155;">Grant</th>
            <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #334155;">Provider</th>
            <th style="padding:8px 12px;text-align:right;border-bottom:1px solid #334155;">Deadline</th>
          </tr>
        </thead>
        <tbody>${grantHtml}</tbody>
      </table>
    </div>

    <!-- Courses Section -->
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
      <h2 style="color:#3b82f6;font-size:16px;margin:0 0 12px;display:flex;align-items:center;gap:8px;">📚 New Training Courses</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">
            <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #334155;">Course</th>
            <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #334155;">Category</th>
            <th style="padding:8px 12px;text-align:right;border-bottom:1px solid #334155;">Price</th>
          </tr>
        </thead>
        <tbody>${courseHtml}</tbody>
      </table>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="https://phdsensei.eds-360.com" style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;">Visit the Dojo</a>
    </div>

    <p style="color:#64748b;font-size:12px;text-align:center;line-height:1.6;border-top:1px solid #1e293b;padding-top:20px;margin-top:24px;">
      You're receiving this because you're a Cyber Dojo member.<br/>
      © 2025 Asaad Morman — Emerging Defense Solutions
    </p>
  </div>
</body></html>`;

      try {
        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: `🥷 Cyber Dojo Weekly Digest — ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          body: html
        });
        sentCount++;
      } catch (e) {
        failCount++;
      }
    }

    return Response.json({ success: true, sent: sentCount, failed: failCount, grants: upcomingGrants.length, newCourses: newCourses.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});