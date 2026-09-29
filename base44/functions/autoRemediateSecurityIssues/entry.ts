import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const AUTO_FIX_CONFIG = {
  form_submission_length: {
    enabled: true,
    max_name: 100,
    max_email: 255,
    max_company: 100,
    max_message: 5000,
    action: 'truncate'
  },
  inactive_subscribers: {
    enabled: true,
    days_inactive: 180,
    action: 'send_reconfirmation'
  },
  suspicious_form_patterns: {
    enabled: true,
    max_submissions_per_hour: 10,
    max_submissions_per_day: 50,
    action: 'flag_and_delete'
  },
  exposed_sensitive_data: {
    enabled: true,
    patterns: ['password', 'credit', 'ssn', 'cvv', 'api.key', 'secret'],
    action: 'sanitize_and_alert'
  },
  malformed_data: {
    enabled: true,
    action: 'delete'
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const remediationLog = [];

    // 1. Check form submissions for length violations
    if (AUTO_FIX_CONFIG.form_submission_length.enabled) {
      try {
        const leads = await base44.entities.Lead.list('-created_date', 100);
        
        for (const lead of leads) {
          let updated = false;
          const updates = {};

          // Truncate fields that exceed limits
          if (lead.name?.length > AUTO_FIX_CONFIG.form_submission_length.max_name) {
            updates.name = lead.name.substring(0, AUTO_FIX_CONFIG.form_submission_length.max_name);
            updated = true;
          }

          if (lead.message?.length > AUTO_FIX_CONFIG.form_submission_length.max_message) {
            updates.message = lead.message.substring(0, AUTO_FIX_CONFIG.form_submission_length.max_message);
            updated = true;
          }

          if (lead.company?.length > AUTO_FIX_CONFIG.form_submission_length.max_company) {
            updates.company = lead.company.substring(0, AUTO_FIX_CONFIG.form_submission_length.max_company);
            updated = true;
          }

          if (updated) {
            await base44.entities.Lead.update(lead.id, updates);
            remediationLog.push({
              type: 'form_submission_length',
              entity: 'Lead',
              entity_id: lead.id,
              action: 'truncated_fields',
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.error('Form submission check failed:', e);
      }
    }

    // 2. Check for inactive subscribers and initiate re-confirmation
    if (AUTO_FIX_CONFIG.inactive_subscribers.enabled) {
      try {
        const subscribers = await base44.entities.Subscriber.list('-created_date', 1000);
        const inactiveThreshold = new Date();
        inactiveThreshold.setDate(inactiveThreshold.getDate() - AUTO_FIX_CONFIG.inactive_subscribers.days_inactive);

        for (const sub of subscribers) {
          const createdDate = new Date(sub.created_date);
          if (createdDate < inactiveThreshold && sub.active) {
            // Send re-confirmation email
            await base44.integrations.Core.SendEmail({
              to: sub.email,
              subject: 'Confirm Your Newsletter Subscription',
              body: `Hi ${sub.name || 'Subscriber'},\n\nWe noticed you haven't engaged with our newsletter recently. Please confirm if you'd like to continue receiving our cybersecurity insights and updates.\n\nThis is an automated security check to maintain a healthy subscriber list.\n\nBest regards,\nAsaad Morman`
            });

            remediationLog.push({
              type: 'inactive_subscriber',
              entity: 'Subscriber',
              entity_id: sub.id,
              action: 'sent_reconfirmation_email',
              email: sub.email,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.error('Inactive subscriber check failed:', e);
      }
    }

    // 3. Check for suspicious form submission patterns
    if (AUTO_FIX_CONFIG.suspicious_form_patterns.enabled) {
      try {
        const allLeads = await base44.entities.Lead.list('-created_date', 500);
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 3600000);
        const oneDayAgo = new Date(now.getTime() - 86400000);

        const suspiciousEmails = {};

        for (const lead of allLeads) {
          const created = new Date(lead.created_date);
          
          // Track submissions per email
          if (!suspiciousEmails[lead.email]) {
            suspiciousEmails[lead.email] = { hour: 0, day: 0, leads: [] };
          }

          if (created > oneHourAgo) suspiciousEmails[lead.email].hour++;
          if (created > oneDayAgo) suspiciousEmails[lead.email].day++;
          suspiciousEmails[lead.email].leads.push(lead.id);
        }

        // Flag and delete suspicious patterns
        for (const [email, data] of Object.entries(suspiciousEmails)) {
          if (data.hour > AUTO_FIX_CONFIG.suspicious_form_patterns.max_submissions_per_hour) {
            // Delete duplicate submissions, keep most recent
            const toDelete = data.leads.slice(0, -1);
            for (const leadId of toDelete) {
              await base44.entities.Lead.delete(leadId);
            }

            remediationLog.push({
              type: 'suspicious_form_pattern',
              email: email,
              action: 'deleted_duplicate_submissions',
              count: toDelete.length,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.error('Suspicious pattern check failed:', e);
      }
    }

    // 4. Check for exposed sensitive data in submissions
    if (AUTO_FIX_CONFIG.exposed_sensitive_data.enabled) {
      try {
        const leads = await base44.entities.Lead.list('-created_date', 200);
        const sensitivePatterns = AUTO_FIX_CONFIG.exposed_sensitive_data.patterns;

        for (const lead of leads) {
          let containsSensitiveData = false;
          const fieldsToCheck = [lead.message, lead.company, lead.title].filter(Boolean);

          for (const field of fieldsToCheck) {
            for (const pattern of sensitivePatterns) {
              if (field?.toLowerCase().includes(pattern.toLowerCase())) {
                containsSensitiveData = true;
                break;
              }
            }
          }

          if (containsSensitiveData) {
            // Sanitize by removing sensitive content and flagging status
            await base44.entities.Lead.update(lead.id, {
              message: '[SANITIZED - SENSITIVE DATA DETECTED]',
              status: 'new' // Reset to new so admin reviews it
            });

            remediationLog.push({
              type: 'exposed_sensitive_data',
              entity: 'Lead',
              entity_id: lead.id,
              action: 'sanitized_and_flagged',
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.error('Sensitive data check failed:', e);
      }
    }

    // 5. Check for malformed data and delete
    if (AUTO_FIX_CONFIG.malformed_data.enabled) {
      try {
        const leads = await base44.entities.Lead.list('-created_date', 200);

        for (const lead of leads) {
          let isMalformed = false;

          // Check for missing required fields
          if (!lead.email || !lead.name || !lead.message) {
            isMalformed = true;
          }

          // Check for invalid email format
          if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
            isMalformed = true;
          }

          if (isMalformed) {
            await base44.entities.Lead.delete(lead.id);
            remediationLog.push({
              type: 'malformed_data',
              entity: 'Lead',
              entity_id: lead.id,
              action: 'deleted',
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.error('Malformed data check failed:', e);
      }
    }

    return Response.json({
      status: 'success',
      remediations_performed: remediationLog.length,
      details: {
        form_length_fixes: remediationLog.filter(r => r.type === 'form_submission_length').length,
        inactive_subscriber_emails: remediationLog.filter(r => r.type === 'inactive_subscriber').length,
        spam_deletions: remediationLog.filter(r => r.type === 'suspicious_form_pattern').length,
        sensitive_data_sanitized: remediationLog.filter(r => r.type === 'exposed_sensitive_data').length,
        malformed_deleted: remediationLog.filter(r => r.type === 'malformed_data').length
      },
      log: remediationLog
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});