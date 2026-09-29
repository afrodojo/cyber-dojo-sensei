import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Scan for exposed/sensitive data patterns
    const issues = [];

    // Check for leads with potential sensitive info
    const leads = await base44.entities.Lead.list('', 100);
    leads.forEach(lead => {
      if (lead.message && lead.message.length > 500) {
        issues.push({
          type: 'potential_pii_in_message',
          severity: 'medium',
          lead_id: lead.id,
          message: 'Lead message contains excessive length - may contain sensitive data. Review and potentially redact.',
          recommendation: 'Audit message content, implement input validation limits, educate users on not submitting sensitive data in forms'
        });
      }
      
      if (lead.phone && lead.phone.length > 15) {
        issues.push({
          type: 'malformed_phone',
          severity: 'low',
          lead_id: lead.id,
          message: 'Phone number exceeds reasonable length',
          recommendation: 'Validate phone input format'
        });
      }
    });

    // Check for subscribers with valid emails
    const subscribers = await base44.entities.Subscriber.list('', 100);
    const inactiveSubscribers = subscribers.filter(s => {
      const lastActive = new Date(s.updated_date);
      const daysSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
      return daysSinceActive > 180 && s.active;
    });

    if (inactiveSubscribers.length > 0) {
      issues.push({
        type: 'inactive_subscribers',
        severity: 'low',
        count: inactiveSubscribers.length,
        message: `${inactiveSubscribers.length} subscribers inactive for 180+ days. Compliance: consider list hygiene.`,
        recommendation: 'Implement opt-in re-confirmation or remove inactive subscribers'
      });
    }

    // Check for resource downloads - ensure legitimate access patterns
    const downloads = await base44.entities.ResourceDownload.list('-created_date', 50);
    const suspiciousPatterns = downloads.filter((d, idx) => {
      if (idx > 0 && downloads[idx - 1].email === d.email) {
        const timeDiff = new Date(d.created_date) - new Date(downloads[idx - 1].created_date);
        return timeDiff < 5000; // Less than 5 seconds between downloads
      }
      return false;
    });

    if (suspiciousPatterns.length > 0) {
      issues.push({
        type: 'suspicious_access_pattern',
        severity: 'medium',
        count: suspiciousPatterns.length,
        message: 'Potential automated bulk download attempts detected',
        recommendation: 'Implement rate limiting on resource downloads, consider CAPTCHA, review IP logs'
      });
    }

    // Security posture recommendations
    const recommendations = [
      {
        area: 'Data Retention',
        action: 'Implement automatic data retention policies - archive or delete leads/signups older than 12 months',
        priority: 'medium'
      },
      {
        area: 'Encryption',
        action: 'Ensure all form submissions are transmitted over HTTPS with TLS 1.2+',
        priority: 'high'
      },
      {
        area: 'Access Control',
        action: 'Limit admin dashboard access by IP whitelist or MFA requirement',
        priority: 'high'
      },
      {
        area: 'Input Validation',
        action: 'Validate and sanitize all user inputs to prevent injection attacks',
        priority: 'high'
      },
      {
        area: 'Privacy',
        action: 'Add privacy notice to forms about data collection and usage',
        priority: 'medium'
      },
      {
        area: 'Monitoring',
        action: 'Set up alerts for unusual activity patterns (mass submissions, API abuse)',
        priority: 'medium'
      }
    ];

    return Response.json({
      status: 'complete',
      scan_date: new Date().toISOString(),
      issues_found: issues.length,
      issues,
      recommendations,
      summary: `Scanned ${leads.length} leads, ${subscribers.length} subscribers, ${downloads.length} downloads. Found ${issues.length} security concerns requiring attention.`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});