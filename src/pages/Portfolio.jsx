import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Target, ChevronDown, ChevronUp, ArrowRight, BookOpen, Mic, Users, Star, Award, Briefcase, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import SEOHead from "../components/seo/SEOHead";
import TrustedBy from "../components/portfolio/TrustedBy";
import LinkedChatWidget from "../components/chat/LiveChatWidget";
import MetricsDashboard from "../components/dashboard/MetricsDashboard";
import MarineCorpsSection from "../components/portfolio/MarineCorpsSection";

const headshotUrl =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6887c5e144c3e560dc989c1b/fe7359ad6_1000003118.jpg";

const quickLinks = [
  {
    icon: Shield,
    title: "Services",
    description: "Red team ops, penetration testing, security consulting & more.",
    path: "Services",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Target,
    title: "Security Assessment",
    description: "Free 5-minute risk assessment with instant recommendations.",
    path: "SecurityAssessment",
    color: "from-red-500 to-orange-600",
  },
  {
    icon: Briefcase,
    title: "Case Studies",
    description: "Real engagements with measurable impact and results.",
    path: "About",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: BookOpen,
    title: "Blog & Bulletins",
    description: "Cybersecurity insights, threat advisories and thought leadership.",
    path: "Blog",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Mic,
    title: "Speaking & Webinars",
    description: "Live events, webinars and professional speaking engagements.",
    path: "Webinars",
    color: "from-amber-500 to-yellow-600",
  },
  {
    icon: Users,
    title: "Contact",
    description: "Reach out for engagements, partnerships or media requests.",
    path: "Contact",
    color: "from-pink-500 to-rose-600",
  },
];

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
      >
        <span className="text-white font-semibold text-sm">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-5 bg-slate-900/60">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Portfolio() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = "Asaad Morman | Cybersecurity & Tactical SME";
    base44.auth
      .me()
      .then((u) => { if (u?.role === "admin") setIsAdmin(true); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <SEOHead
        title="Asaad Morman | Cybersecurity & Tactical SME"
        description="Elite Cybersecurity Professional & Entrepreneur. PhD Researcher, US Marine Veteran, Founder of Emerging Defense Solutions."
        includePersonSchema={true}
        includeOrgSchema={true}
      />
      <LinkedChatWidget pageName="Portfolio" />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-3/4 h-full bg-gradient-to-br from-cyan-500/8 to-transparent rounded-full blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-3/5 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-red-300 font-medium text-sm">TS/SCI w/CI Polygraph</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-white">
                Asaad Morman
              </h1>

              <div className="relative mb-6 p-5 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
                <p className="text-xs text-cyan-400 uppercase tracking-widest font-semibold mb-2">
                  PhD Dissertation
                </p>
                <p className="text-white font-bold text-lg leading-snug">
                  The Sentinel Ecosystem: Autonomous Hyper-Convergence of Generative AI and Machine Learning
                </p>
              </div>

              <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                <span className="text-cyan-400 font-semibold">Cybersecurity SME</span> &bull;{" "}
                <span className="text-violet-400 font-semibold">PhD Researcher</span> &bull;{" "}
                <span className="text-green-400 font-semibold">US Marine Veteran</span> &bull;{" "}
                <span className="text-emerald-400 font-semibold">Cybersecurity Entrepreneur</span>
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {["Outpost Zero", "Izulu Sentinel", "ASOSINT", "Red Team Expert", "Security Architect"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-600 bg-slate-800/60 text-slate-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                >
                  <Link to={createPageUrl("Services")} onClick={() => window.scrollTo(0, 0)}>
                    View Services
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Link to={createPageUrl("About")} onClick={() => window.scrollTo(0, 0)}>
                    Full Profile
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Headshot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:w-2/5 flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 rounded-full blur-2xl opacity-40"
                />
                <img
                  src={headshotUrl}
                  alt="Asaad Morman"
                  className="relative w-full h-full object-cover object-top rounded-full border-4 border-slate-700/50 shadow-2xl z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="py-10 bg-slate-950">
        <TrustedBy />
      </section>

      {/* ── QUICK METRICS (collapsed) ── */}
      <section className="py-6 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <CollapsibleSection title="📊 Real Results — Measurable Impact">
            <MetricsDashboard />
          </CollapsibleSection>
        </div>
      </section>

      {/* ── QUICK LINKS GRID ── */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Explore</h2>
            <p className="text-slate-400 text-sm">Everything Asaad Morman — organized for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                to={createPageUrl(item.path)}
                onClick={() => window.scrollTo(0, 0)}
                className="group relative flex flex-col gap-3 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800 transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mt-auto self-end" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARINE CORPS SERVICE ── */}
      <MarineCorpsSection />

      {/* ── COLLAPSIBLE EXTRAS ── */}
      <section className="py-12 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 space-y-3">
          <CollapsibleSection title="🎖️ Military Service & Background">
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              US Marine Corps veteran with service in cybersecurity, intelligence, and tactical operations. Holder of TS/SCI clearance with CI Polygraph.
            </p>
            <Button asChild size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("About")} onClick={() => window.scrollTo(0, 0)}>
                Full Background <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CollapsibleSection>

          <CollapsibleSection title="🏢 Business Ventures — Emerging Defense Solutions">
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Founder & CEO of Emerging Defense Solutions (EDS), with specialized divisions spanning cybersecurity consulting, tactical training, and defense services.
            </p>
            <Button asChild size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("Services")} onClick={() => window.scrollTo(0, 0)}>
                Explore Services <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CollapsibleSection>

          <CollapsibleSection title="📰 Legislative Alerts — Cybersecurity & 2A Law Updates">
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Weekly AI-curated summaries of cybersecurity regulations and Second Amendment law changes delivered to your inbox.
            </p>
            <Button asChild size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("CyberBulletins")} onClick={() => window.scrollTo(0, 0)}>
                View Bulletins <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CollapsibleSection>

          <CollapsibleSection title="🧮 ROI Calculator — What's Your Security Risk Costing You?">
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Use the free ROI calculator to estimate potential savings from proactive cybersecurity investments.
            </p>
            <Button asChild size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("ROICalculator")} onClick={() => window.scrollTo(0, 0)}>
                Open Calculator <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CollapsibleSection>
        </div>
      </section>

      {/* ── ASSESSMENT CTA ── */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">How Secure Is Your Organization?</h2>
          <p className="text-slate-300 mb-7 max-w-xl mx-auto text-sm">
            Take our free 5-minute security assessment and get an instant risk score with actionable recommendations.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
          >
            <Link to={createPageUrl("SecurityAssessment")} onClick={() => window.scrollTo(0, 0)}>
              <Target className="w-5 h-5 mr-2" />
              Start Free Assessment
            </Link>
          </Button>
        </div>
      </section>

      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-40">
          <Link to={createPageUrl("AdminDashboard")} onClick={() => window.scrollTo(0, 0)}>
            <Button size="sm" className="bg-slate-700 hover:bg-slate-600 text-white shadow-xl">
              ⚙ Admin
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}