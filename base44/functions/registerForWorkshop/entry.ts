import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { workshopId, name, email, phone, organization, notes } = await req.json();

  if (!workshopId || !name || !email) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Fetch workshop details
  const workshops = await base44.asServiceRole.entities.Workshop.filter({ id: workshopId });
  const workshop = workshops[0];
  if (!workshop) return Response.json({ error: 'Workshop not found' }, { status: 404 });

  if (workshop.status === 'cancelled' || workshop.status === 'completed') {
    return Response.json({ error: 'This workshop is no longer accepting registrations' }, { status: 400 });
  }

  // Check capacity
  const existingRegs = await base44.asServiceRole.entities.WorkshopRegistration.filter({
    workshop_id: workshopId,
    status: 'confirmed'
  });
  const isFull = workshop.max_attendees && existingRegs.length >= workshop.max_attendees;

  // Check for duplicate
  const duplicate = existingRegs.find(r => r.email === email);
  if (duplicate) {
    return Response.json({ error: 'You are already registered for this workshop.' }, { status: 409 });
  }

  const registrationStatus = isFull ? 'waitlisted' : 'confirmed';

  // Create registration
  const registration = await base44.asServiceRole.entities.WorkshopRegistration.create({
    workshop_id: workshopId,
    workshop_title: workshop.title,
    workshop_date: workshop.date,
    name,
    email,
    phone: phone || '',
    organization: organization || '',
    notes: notes || '',
    status: registrationStatus
  });

  // Increment registration count
  if (!isFull) {
    await base44.asServiceRole.entities.Workshop.update(workshopId, {
      registration_count: (workshop.registration_count || 0) + 1
    });
  }

  // Build Google Calendar link
  const dateStr = workshop.date.replace(/-/g, '');
  const gcalStart = `${dateStr}T${workshop.start_time_iso || '100000'}`;
  const gcalEnd = `${dateStr}T${workshop.end_time_iso || '120000'}`;
  const location = workshop.meeting_link || workshop.location || 'Online';
  const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(workshop.title)}&dates=${gcalStart}/${gcalEnd}&details=${encodeURIComponent(`Workshop with Asaad Morman\n\n${workshop.description}\n\nJoin: ${location}`)}&location=${encodeURIComponent(location)}`;

  // Send confirmation email via Gmail connector
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

  const confirmOrWaitlist = registrationStatus === 'confirmed'
    ? `<p style="color:#4ade80;font-weight:bold;">✅ Your spot is confirmed!</p>`
    : `<p style="color:#fbbf24;font-weight:bold;">⏳ You've been added to the waitlist.</p>`;

  const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#0891b2,#1d4ed8);padding:32px 40px;">
        <div style="font-size:22px;font-weight:bold;color:#fff;">🛡️ Workshop Registration</div>
        <div style="font-size:13px;color:#bae6fd;margin-top:4px;">Heritage Shield Defense Academy / CyberDojo Solutions</div>
      </div>
      <div style="padding:32px 40px;">
        <p style="font-size:16px;">Hi <strong>${name}</strong>,</p>
        ${confirmOrWaitlist}
        <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #0891b2;">
          <h2 style="color:#fff;margin:0 0 12px;">${workshop.title}</h2>
          <p style="margin:4px 0;color:#94a3b8;">📅 <strong style="color:#e2e8f0;">${new Date(workshop.date).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</strong></p>
          <p style="margin:4px 0;color:#94a3b8;">🕐 <strong style="color:#e2e8f0;">${workshop.start_time}${workshop.end_time ? ' – ' + workshop.end_time : ''}</strong></p>
          <p style="margin:4px 0;color:#94a3b8;">📍 <strong style="color:#e2e8f0;">${location}</strong></p>
          <p style="margin:4px 0;color:#94a3b8;">👤 <strong style="color:#e2e8f0;">Instructor: ${workshop.instructor || 'Asaad Morman'}</strong></p>
        </div>
        ${registrationStatus === 'confirmed' ? `
        <div style="text-align:center;margin:28px 0;">
          <a href="${gcalLink}" target="_blank" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#0891b2,#1d4ed8);color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
            📅 Add to Google Calendar
          </a>
        </div>` : ''}
        <p style="color:#64748b;font-size:13px;">Questions? Reply to this email or contact cyberdojosensai@gmail.com</p>
      </div>
      <div style="background:#1e293b;padding:16px 40px;text-align:center;font-size:11px;color:#475569;">
        © 2025 Asaad Morman · Heritage Shield Defense Academy · CyberDojo Solutions
      </div>
    </div>
  `;

  const subject = registrationStatus === 'confirmed'
    ? `✅ Confirmed: ${workshop.title}`
    : `⏳ Waitlisted: ${workshop.title}`;

  const message = [
    `To: ${email}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    emailHtml
  ].join('\n');

  const encoded = btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encoded })
  });

  return Response.json({ success: true, status: registrationStatus, gcalLink, registrationId: registration.id });
});