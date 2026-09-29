import React from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Shield, Database, Trash2, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "../components/seo/SEOHead";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data We Collect",
      icon: Database,
      content: [
        "We collect the following types of information:",
        "• Contact Information: name, email, phone, company (voluntarily provided)",
        "• Usage Data: pages visited, time spent, clicks, referrer information",
        "• Device Information: browser type, OS, device type, IP address",
        "• Session Data: anonymous session identifiers and cookies for functionality",
        "• Webinar Registration: registration details and attendance records",
        "• Communications: emails, contact form submissions, support inquiries",
        "• Analytics: aggregated data about user behavior and trends"
      ]
    },
    {
      title: "How We Use Your Data",
      icon: Eye,
      content: [
        "Your data is used solely for:",
        "• Providing and improving website functionality",
        "• Sending newsletters and updates (with your consent)",
        "• Responding to inquiries and support requests",
        "• Conducting webinars and managing registrations",
        "• Security monitoring and fraud detection",
        "• Analyzing usage patterns to improve content and services",
        "• Complying with legal obligations",
        "We never sell personal data to third parties without explicit consent"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "• All data in transit is encrypted using TLS 1.2+",
        "• Sensitive data at rest is encrypted using industry-standard algorithms",
        "• Access is restricted to authorized personnel only",
        "• Regular security audits and penetration testing are conducted",
        "• We maintain compliance with GDPR, CCPA, and other privacy regulations",
        "• Incident response procedures are in place for potential breaches",
        "• Data is stored on secure, redundant servers with backup protocols"
      ]
    },
    {
      title: "Your Privacy Rights",
      icon: UserCheck,
      content: [
        "You have the following rights regarding your personal data:",
        "• Right to Access: request a copy of data we hold about you",
        "• Right to Rectification: correct inaccurate or incomplete data",
        "• Right to Erasure: request deletion of your data (right to be forgotten)",
        "• Right to Data Portability: receive data in a portable format",
        "• Right to Opt-Out: unsubscribe from communications at any time",
        "• Right to Lodge Complaints: contact your local data protection authority",
        "To exercise these rights, contact: privacy@asaadmorman.com"
      ]
    },
    {
      title: "Data Retention",
      icon: Trash2,
      content: [
        "• User account data: retained for the duration of account existence",
        "• Newsletter subscriptions: retained until unsubscribe requested",
        "• Webinar registrations: retained for 12 months after event",
        "• Contact form submissions: retained for 24 months for follow-up",
        "• Analytics data: aggregated and anonymous data retained indefinitely",
        "• Security logs: retained for 12 months for compliance purposes",
        "• You can request deletion of your data at any time"
      ]
    },
    {
      title: "Monitoring & Security Logging",
      icon: Shield,
      content: [
        "• All website activity is logged for security purposes",
        "• Monitoring includes:",
        "  - Detection of unauthorized access attempts",
        "  - Identification of bot activity and scraping",
        "  - Tracking of suspicious behavior patterns",
        "  - Recording of policy violations",
        "• Logs are retained for security audits and legal compliance",
        "• Log data is protected with the same security measures as user data",
        "• Only authorized administrators can access security logs"
      ]
    },
    {
      title: "Third-Party Integrations",
      icon: Shield,
      content: [
        "• HubSpot: For CRM and contact management (see HubSpot Privacy Policy)",
        "• Gmail: For email delivery and communications (see Google Privacy Policy)",
        "• Analytics: Aggregated usage tracking",
        "• These services process data according to their privacy policies",
        "• We ensure all integrations comply with data protection laws",
        "• You can opt-out of specific integrations upon request"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20">
      <SEOHead
        title="Privacy Policy"
        description="Review our comprehensive privacy policy and data protection practices."
        type="page"
      />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-400">
            How We Collect, Use, and Protect Your Personal Information
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Last Updated: March 1, 2026 | Effective Date: March 1, 2026
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Icon className="w-6 h-6 text-green-400" />
                      </div>
                      <CardTitle className="text-white">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-8"
        >
          <h3 className="text-lg font-bold text-green-400 mb-4">Contact Our Privacy Team</h3>
          <p className="text-slate-300 mb-4">
            For privacy inquiries, data access requests, or to exercise your privacy rights:
          </p>
          <div className="space-y-2 text-slate-300">
            <p>📧 Email: privacy@asaadmorman.com</p>
            <p>📞 Phone: 657-658-5859</p>
            <p>📍 Address: Fredericksburg, VA</p>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            Response time: We aim to respond to all privacy requests within 30 days in accordance with GDPR and CCPA requirements.
          </p>
        </motion.div>
      </div>
    </div>
  );
}