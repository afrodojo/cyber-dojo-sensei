import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SEOHead from "@/components/seo/SEOHead";
import {
  Microscope,
  ShieldCheck,
  Brain,
  DollarSign,
  HandHeart,
  Send,
  CheckCircle,
  Users,
  FlaskConical,
  Target,
  Cpu,
  Network,
  ArrowRight
} from "lucide-react";

export default function ResearchFunding() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    assistance_type: "financial-sponsorship",
    funding_amount: "5k-25k",
    research_focus: "general",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.ResearchFundingInquiry.create({
        ...formData,
        status: "new"
      });
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        organization: "",
        role: "",
        assistance_type: "financial-sponsorship",
        funding_amount: "5k-25k",
        research_focus: "general",
        message: ""
      });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const researchAreas = [
    {
      icon: ShieldCheck,
      title: "Autonomous Defense Systems",
      description: "Researching AI-driven defensive architectures that detect, respond to, and neutralize threats in real time without human intervention."
    },
    {
      icon: Brain,
      title: "AI Security & Adversarial ML",
      description: "Investigating adversarial attacks on machine learning models and developing robust defenses for security-critical AI systems."
    },
    {
      icon: Network,
      title: "Threat Intelligence & Attribution",
      description: "Building frameworks for real-time threat intelligence sharing and adversary attribution across defense and critical infrastructure sectors."
    },
    {
      icon: Cpu,
      title: "Quantum-Resilient Cybersecurity",
      description: "Exploring post-quantum cryptography and quantum-resistant protocols to safeguard national security communications."
    },
    {
      icon: FlaskConical,
      title: "Red Team Methodology Research",
      description: "Advancing the science of offensive security testing — formalizing tradecraft, metrics, and reproducible engagement frameworks."
    },
    {
      icon: Target,
      title: "Critical Infrastructure Protection",
      description: "Studying attack surfaces in energy, water, and defense industrial base systems to harden operational technology environments."
    }
  ];

  const fundingTiers = [
    {
      amount: "$5K – $25K",
      label: "Seed Supporter",
      impact: "Funds specialized tooling licenses and compute resources for active research sprints.",
      icon: FlaskConical
    },
    {
      amount: "$25K – $50K",
      label: "Research Partner",
      impact: "Sponsors a focused research track with publishable findings and co-authored whitepapers.",
      icon: Microscope
    },
    {
      amount: "$50K – $100K",
      label: "Innovation Sponsor",
      impact: "Underwrites a multi-month research initiative with prototype development and conference dissemination.",
      icon: ShieldCheck
    },
    {
      amount: "$100K+",
      label: "Strategic Patron",
      impact: "Endows a long-term research program with dedicated personnel, lab infrastructure, and open-source releases.",
      icon: Target
    }
  ];

  const assistanceTypes = [
    { value: "financial-sponsorship", label: "Financial Sponsorship" },
    { value: "equipment-resources", label: "Equipment / Resources" },
    { value: "mentorship-advisory", label: "Mentorship / Advisory" },
    { value: "research-partnership", label: "Research Partnership" },
    { value: "grant-sponsororship", label: "Grant Sponsorship" },
    { value: "other", label: "Other" }
  ];

  const fundingLevels = [
    { value: "under-5k", label: "Under $5,000" },
    { value: "5k-25k", label: "$5,000 – $25,000" },
    { value: "25k-50k", label: "$25,000 – $50,000" },
    { value: "50k-100k", label: "$50,000 – $100,000" },
    { value: "100k-plus", label: "$100,000+" },
    { value: "non-monetary", label: "Non-Monetary / In-Kind" }
  ];

  const focusAreas = [
    { value: "autonomous-defense", label: "Autonomous Defense Systems" },
    { value: "threat-intelligence", label: "Threat Intelligence & Attribution" },
    { value: "ai-security", label: "AI Security & Adversarial ML" },
    { value: "quantum-cybersecurity", label: "Quantum-Resilient Cybersecurity" },
    { value: "red-team-operations", label: "Red Team Methodology Research" },
    { value: "general", label: "General / Multiple Areas" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-20">
      <SEOHead
        title="Sponsor My Research | Asaad Morman — Cybersecurity Research Funding"
        description="Support cutting-edge cybersecurity and defense research. Partner with Asaad Morman to fund autonomous defense, AI security, threat intelligence, and critical infrastructure protection research."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <HandHeart className="w-3.5 h-3.5" />
            Research Sponsorship Program
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
            Fund the Future of <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Cyber Defense</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            My research advances the science of cybersecurity, autonomous defense, and critical infrastructure protection.
            Your sponsorship directly accelerates publishable, open, and mission-critical research that strengthens national security.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {[
            { icon: FlaskConical, value: "6+", label: "Active Research Tracks", color: "text-indigo-400" },
            { icon: DollarSign, value: "$250K", label: "Annual Funding Goal", color: "text-emerald-400" },
            { icon: Users, value: "Open", label: "Collaboration Model", color: "text-cyan-400" },
            { icon: ShieldCheck, value: "TS/SCI", label: "Cleared Researcher", color: "text-amber-400" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center">
              <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Research Areas */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Research Focus Areas</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Each track produces peer-reviewed findings, open-source tools, and actionable defense methodologies.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {researchAreas.map((area, idx) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/40 transition-colors"
              >
                <div className="w-11 h-11 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                  <area.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{area.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Funding Tiers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Sponsorship Tiers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Choose a contribution level that matches your commitment to advancing cybersecurity research.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fundingTiers.map((tier, idx) => (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors flex flex-col"
              >
                <tier.icon className="w-8 h-8 text-indigo-400 mb-3" />
                <p className="text-2xl font-black text-white mb-1">{tier.amount}</p>
                <p className="text-sm font-semibold text-indigo-300 mb-3">{tier.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed flex-grow">{tier.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Sponsor + Form */}
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Why Sponsor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Offer Your Support</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Whether you represent a defense contractor, academic institution, government agency, or simply believe in
              the mission — I want to hear from you. Funding, equipment, mentorship, and research partnerships all
              accelerate the work.
            </p>
            <div className="space-y-4">
              {[
                { icon: DollarSign, text: "Direct financial sponsorship of a specific research track" },
                { icon: Cpu, text: "Equipment, compute, or lab resource contributions" },
                { icon: Users, text: "Research collaboration and co-authorship opportunities" },
                { icon: Microscope, text: "Mentorship and advisory engagement" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-sm text-slate-300 pt-1.5">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-5">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-semibold text-indigo-300">Transparency commitment:</span> All sponsored research
                outcomes are documented, with open-source tools and findings shared with the community wherever
                classification allows.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8"
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-emerald-300 text-sm">
                  Thank you for your interest in sponsoring my research. I'll reach out personally within 48 hours.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Company / Institution"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role / Title</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Your title"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assistance Type</label>
                  <select
                    name="assistance_type"
                    value={formData.assistance_type}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    {assistanceTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contribution Level</label>
                  <select
                    name="funding_amount"
                    value={formData.funding_amount}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    {fundingLevels.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Research Focus of Interest</label>
                <select
                  name="research_focus"
                  value={formData.research_focus}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  {focusAreas.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your interest in supporting this research, any specific track you'd like to sponsor, or questions you have..."
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Sending..." : "Submit Sponsorship Inquiry"}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 bg-gradient-to-br from-indigo-900/20 to-cyan-900/10 border border-indigo-500/20 rounded-2xl p-8 text-center"
        >
          <Microscope className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Prefer to talk first?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-6">
            Schedule a call to discuss research alignment, sponsorship structures, or partnership opportunities in detail.
          </p>
          <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold">
            <a href="/Contact" onClick={() => window.scrollTo(0, 0)}>
              Contact Me Directly <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}