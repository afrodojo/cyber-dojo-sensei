import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_EMAIL = "cyberdojosensei@gmail.com";
const PHONE = "657-658-5859";
const PORTAL_URL = Deno.env.get("BASE44_APP_URL") || "https://asaad-morman.app";

// Strip HTML tags, stray angle brackets, and control chars; cap length.
function sanitize(value, maxLen = 1000) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLen);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const {
      name, email, title, user_type, rating, text, company, relationship
    } = body || {};

    // ── Validation ──────────────────────────────────────────────
    if (!name || !name.trim()) {
      return Response.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return Response.json({ error: "Please enter your email address." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!title || !title.trim()) {
      return Response.json({ error: "Please enter your role or title." }, { status: 400 });
    }
    if (!user_type) {
      return Response.json({ error: "Please select a user type." }, { status: 400 });
    }
    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return Response.json({ error: "Please select a star rating between 1 and 5." }, { status: 400 });
    }
    if (!text || text.trim().length < 10) {
      return Response.json({ error: "Please write a review of at least 10 characters." }, { status: 400 });
    }

    const allowedTypes = ["client-employer", "career-seeker", "educational-institution"];
    if (!allowedTypes.includes(user_type)) {
      return Response.json({ error: "Invalid user type." }, { status: 400 });
    }

    // ── Sanitize & persist (pending approval) ──────────────────
    const record = {
      name: sanitize(name, 120),
      email: email.trim().toLowerCase(),
      title: sanitize(title, 120),
      user_type,
      rating: Math.round(parsedRating),
      text: sanitize(text, 1000),
      company: sanitize(company, 120),
      relationship: sanitize(relationship, 120),
      is_approved: false,
    };

    const created = await base44.asServiceRole.entities.Testimonial.create(record);

    // ── Thank-you email ─────────────────────────────────────────
    const firstName = record.name.split(" ")[0] || "there";
    const header = `Hi ${firstName},\n\nThank you so much for taking the time to share your review! Your feedback means a great deal and helps others understand the value of the Cyber Dojo.\n\n`;
    const footer = `\n\nWith appreciation,\nAsaad Morman\nCyber Dojo Sensei\n${CONTACT_EMAIL} • ${PHONE}`;

    let reviewBody;
    if (user_type === "client-employer" || user_type === "educational-institution") {
      reviewBody = `Thank you for partnering with the Dojo. If you would like to inquire about further custom corporate training or talent sourcing, please contact our enterprise team directly at ${CONTACT_EMAIL} or call ${PHONE}.`;
    } else {
      reviewBody = `Congratulations on completing your training phase! Thank you for the review. To inquire about advanced mentoring, career coaching, or our elite PhD Sensei pathways, reply directly to this email or visit our portal at ${PORTAL_URL}.`;
    }

    const emailBody = header + reviewBody + footer;
    const subject = "Thank You for Your Review — Cyber Dojo Sensei";

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: record.email,
        subject,
        body: emailBody,
        from_name: "Asaad Morman — Cyber Dojo Sensei"
      });
    } catch (emailErr) {
      console.error("Thank-you email send failed:", emailErr?.message || emailErr);
      // Record is still saved; we just notify the client that email delivery was delayed.
      return Response.json({
        success: true,
        id: created.id,
        warning: "Your review was saved, but the confirmation email could not be delivered right now."
      });
    }

    return Response.json({ success: true, id: created.id });
  } catch (error) {
    console.error("submitTestimonial error:", error?.message || error);
    return Response.json(
      { error: error?.message || "Something went wrong while submitting your review." },
      { status: 500 }
    );
  }
});