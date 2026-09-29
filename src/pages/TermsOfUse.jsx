import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "../components/seo/SEOHead";

export default function TermsOfUsePage() {
  const sections = [
    {
      title: "Acceptable Use Policy",
      icon: Shield,
      content: [
        "Users agree not to engage in any of the following prohibited conduct:",
        "• Unauthorized access, collection, or scraping of website content or data",
        "• Automated data harvesting, web scraping, or bot activity without explicit permission",
        "• Distributed denial of service (DDoS) or brute force attacks",
        "• Reverse engineering or attempting to bypass security measures",
        "• Uploading malware, viruses, or malicious code",
        "• Impersonation or misrepresentation of identity",
        "• Harassment, threats, or defamatory content",
        "• Violation of intellectual property rights",
        "• Violation of applicable local, state, federal, or international laws"
      ]
    },
    {
      title: "Data Protection & Privacy",
      icon: Lock,
      content: [
        "• All personal data collected is processed in accordance with GDPR, CCPA, and other applicable privacy regulations",
        "• User data is encrypted in transit (TLS) and at rest using industry-standard encryption",
        "• We do not sell or share personal information with third parties without explicit consent",
        "• Data retention policies comply with legal requirements and are regularly audited",
        "• Users have the right to access, modify, or delete their personal data upon request"
      ]
    },
    {
      title: "Content Ownership & Intellectual Property",
      icon: CheckCircle2,
      content: [
        "• All website content, including blog posts, case studies, and resources, is the property of Asaad Morman or licensed third parties",
        "• Users may view and download content for personal, non-commercial use only",
        "• Commercial use, reproduction, or distribution requires written permission",
        "• User-generated content remains the property of the user but grants us a license to display and modify as needed",
        "• Unauthorized reproduction or use of proprietary information is prohibited"
      ]
    },
    {
      title: "Monitoring & Enforcement",
      icon: AlertCircle,
      content: [
        "• We employ automated monitoring systems to detect and prevent policy violations",
        "• All user activity is logged and analyzed for compliance with this policy",
        "• Violations trigger immediate notifications and investigation protocols",
        "• Users engaging in prohibited conduct may face:",
        "  - IP blocking or rate limiting",
        "  - Account suspension or termination",
        "  - Legal action and law enforcement notification for severe violations",
        "• Monitoring is performed in compliance with privacy laws and regulations"
      ]
    },
    {
      title: "Compliance & Legal",
      icon: Shield,
      content: [
        "• This website complies with:",
        "  - Computer Fraud and Abuse Act (CFAA)",
        "  - General Data Protection Regulation (GDPR)",
        "  - California Consumer Privacy Act (CCPA)",
        "  - Children's Online Privacy Protection Act (COPPA)",
        "  - Accessibility Guidelines (WCAG 2.1 AA)",
        "• Users agree to comply with all applicable local, state, federal, and international laws",
        "• Violations may result in civil or criminal prosecution",
        "• We reserve the right to cooperate with law enforcement investigations"
      ]
    },
    {
      title: "Third-Party Services",
      icon: Shield,
      content: [
        "• This website integrates with HubSpot for CRM and contact management",
        "• Third-party integrations are subject to their respective privacy policies and terms",
        "• We verify that all third-party services comply with data protection regulations",
        "• Users acknowledge and accept the terms of service for any integrated platforms"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20">
      <SEOHead
        title="Terms of Use & Acceptable Use Policy"
        description="Review our comprehensive terms of use, acceptable use policy, and security guidelines."
        type="page"
      />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Terms of Use
          </h1>
          <p className="text-xl text-slate-400">
            Acceptable Use Policy, Data Protection, and Security Guidelines
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Last Updated: March 1, 2026
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
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-400" />
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
          className="mt-16 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg"
        >
          <h3 className="text-lg font-bold text-blue-400 mb-3">Security Awareness</h3>
          <p className="text-slate-300">
            By accessing this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and Acceptable Use Policy. 
            We employ advanced security monitoring and automated detection systems to protect against unauthorized access, data harvesting, and policy violations. 
            Users engaging in prohibited conduct may face immediate action including IP blocking, account suspension, and legal prosecution.
          </p>
        </motion.div>
      </div>
    </div>
  );
}