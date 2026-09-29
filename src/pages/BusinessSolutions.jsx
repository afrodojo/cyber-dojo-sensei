import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Building2, Shield, Target, Users, BarChart3, Briefcase, GraduationCap, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PillarLayout from "@/components/pillars/PillarLayout";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Red Team Operations",
    description: "Adversary emulation and attack simulations to test your defenses against real-world threats.",
    to: "Services",
    cta: "Explore Services"
  },
  {
    icon: Target,
    title: "Penetration Testing",
    description: "Comprehensive security assessments across network, application, and physical attack surfaces.",
    to: "SecurityAssessment",
    cta: "Free Assessment"
  },
  {
    icon: Users,
    title: "Executive Briefings",
    description: "Tailored security briefings for leadership teams to understand risk and drive strategic decisions.",
    to: "ExecutiveBriefings",
    cta: "Schedule a Briefing"
  },
  {
    icon: GraduationCap,
    title: "Enterprise Training",
    description: "Custom training programs for your teams — from security fundamentals to advanced red team tactics.",
    to: "TrainingCatalog",
    cta: "View Catalog"
  },
  {
    icon: BarChart3,
    title: "Capability Matrix",
    description: "Full spectrum of cybersecurity capabilities mapped to your organization's maturity level.",
    to: "CapabilityMatrix",
    cta: "View Matrix"
  },
  {
    icon: Briefcase,
    title: "Workshops",
    description: "Hands-on, interactive workshops covering the latest cybersecurity techniques and strategies.",
    to: "WorkshopBooking",
    cta: "Book a Workshop"
  }
];

export default function BusinessSolutions() {
  return (
    <PillarLayout
      icon={Building2}
      title="Business Solutions"
      tagline="Secure Your Enterprise"
      description="Elite cybersecurity services and training for organizations that need to protect critical assets, meet compliance requirements, and build resilient security cultures."
      accent="cyan"
      seoTitle="Business Solutions | Enterprise Cybersecurity Services"
      seoDescription="Red team operations, penetration testing, executive briefings, and enterprise training for organizations."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition-colors"
          >
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
            <Link to={createPageUrl(feature.to)} onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium hover:gap-2 transition-all">
              {feature.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </PillarLayout>
  );
}