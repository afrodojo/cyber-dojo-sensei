import React from "react";
import { motion } from "framer-motion";
import {
  Shield, Star, Award, Crosshair, Radar, Swords,
  ChevronRight, Anchor, Zap, Lock, Eye, Target
} from "lucide-react";

const SERVICE_YEARS = "2001–2008";
const YEARS_SERVED = "7 Years";

const SERVICE_STATS = [
  { icon: Shield, label: "Years of Service", value: YEARS_SERVED, color: "text-ninja-green" },
  { icon: Anchor, label: "Branch", value: "USMC", color: "text-ninja-red" },
  { icon: Lock, label: "Clearance", value: "TS/SCI", color: "text-ninja-green" },
  { icon: Swords, label: "MCMAP", value: "1st Dan", color: "text-ninja-red" },
];

const SERVICE_ROLES = [
  {
    title: "Avionics Technician",
    period: "Aug 2002 – Apr 2008",
    summary: "Maintained and troubleshot aircraft electrical and electronic systems to the highest precision standards.",
    icon: Zap,
  },
  {
    title: "MCMAP Black Belt Instructor",
    period: "2005 – 2008",
    summary: "Trained combat personnel in Marine Corps Martial Arts Program; mentored junior instructors in real-world combat application.",
    icon: Swords,
  },
  {
    title: "Assistant Facilities Manager",
    period: "2007 – 2008",
    summary: "Managed security oversight of 250+ barracks, access rosters, emergency protocols, and a multi-million dollar renovation — ahead of schedule.",
    icon: Shield,
  },
  {
    title: "Production Control Specialist",
    period: "2002 – 2003",
    summary: "Managed logistics, inventory, and resource allocation to maintain operational readiness and supply chain efficiency.",
    icon: Radar,
  },
];

const COMPETENCY_MAP = [
  {
    military: "Threat Assessment & Situational Awareness",
    security: "Threat Intelligence & Risk Analysis",
    description: "Combat-zone situational awareness directly translates to proactive threat hunting and intelligence-driven defense.",
    icon: Radar,
  },
  {
    military: "Physical Security & Access Control",
    security: "Zero-Trust Architecture & IAM",
    description: "Managing barracks access rosters and facility security evolved into designing identity access management and zero-trust frameworks.",
    icon: Lock,
  },
  {
    military: "Close-Quarters Combat (MCMAP)",
    security: "Red Team & Offensive Operations",
    description: "MCMAP combat methodology mirrors red team operations — disciplined, calculated aggression to expose vulnerabilities.",
    icon: Crosshair,
  },
  {
    military: "Avionics Systems Troubleshooting",
    security: "Reverse Engineering & Malware Analysis",
    description: "Precision fault isolation in aviation electronics became the foundation for reverse engineering and malware analysis.",
    icon: Zap,
  },
  {
    military: "Combat Leadership & Discipline",
    security: "Security Operations Center Leadership",
    description: "Leading Marines under pressure directly informs SOC team leadership, incident response command, and crisis decision-making.",
    icon: Star,
  },
  {
    military: "Emergency Response Protocols",
    security: "Incident Response & Contingency",
    description: "Developing emergency escape routes and barracks protocols evolved into building enterprise incident response playbooks.",
    icon: Shield,
  },
];

const VALUES = [
  {
    name: "Honor",
    military: "Integrity in all things",
    security: "Ethical hacking & responsible disclosure",
    icon: Award,
  },
  {
    name: "Courage",
    military: "Fearless under fire",
    security: "Calculated risk in red team operations",
    icon: Shield,
  },
  {
    name: "Commitment",
    military: "Mission above self",
    security: "Relentless defense of national assets",
    icon: Star,
  },
];

export default function MarineCorpsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-ninja-void" />
      <div className="absolute inset-0 ninja-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-ninja-void via-ninja-surface/30 to-ninja-void" />

      {/* Neon accent lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ninja-green/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ninja-red/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-ninja-green/10 border border-ninja-green/30 rounded-full px-4 py-2 mb-6">
            <Anchor className="w-4 h-4 text-ninja-green" />
            <span className="text-ninja-green font-semibold text-sm tracking-wide uppercase">United States Marine Corps</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-ninja-green via-white to-ninja-red bg-clip-text text-transparent">
              7 Years of Service
            </span>
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-ninja-green" />
            <Star className="w-5 h-5 text-ninja-green" />
            <span className="text-slate-400 font-medium text-sm">{SERVICE_YEARS}</span>
            <Star className="w-5 h-5 text-ninja-red" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-ninja-red" />
          </div>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From the disciplined ranks of the Marine Corps to the frontier of cybersecurity —
            the skills forged in uniform now defend the digital battlespace.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {SERVICE_STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="ninja-surface border border-slate-700/50 rounded-xl p-5 text-center hover:border-ninja-green/40 transition-colors ninja-glow"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-xs font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Service Roles Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Shield className="w-6 h-6 text-ninja-green" />
            Roles During Service
          </h3>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ninja-green/50 via-slate-700 to-ninja-red/50" />

            <div className="space-y-8">
              {SERVICE_ROLES.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ninja-green border-2 border-ninja-void z-10 ninja-glow" />

                  {/* Spacer for desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card */}
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                    <div className="ninja-surface border border-slate-700/50 rounded-xl p-5 hover:border-ninja-green/40 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <role.icon className="w-5 h-5 text-ninja-green flex-shrink-0" />
                        <h4 className="text-white font-bold text-base">{role.title}</h4>
                      </div>
                      <span className="inline-block text-xs text-ninja-red font-semibold mb-3 border border-ninja-red/30 bg-ninja-red/10 rounded-full px-3 py-0.5">
                        {role.period}
                      </span>
                      <p className="text-slate-400 text-sm leading-relaxed">{role.summary}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Battlefield to Cyber Battlefield ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 text-ninja-red" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">From Battlefield to Cyber Battlefield</h3>
              <Crosshair className="w-5 h-5 text-ninja-green" />
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Every military skill maps directly to a core cybersecurity competency. This is how 7 years of
              Marine Corps service became the foundation of an elite security career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPETENCY_MAP.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="ninja-surface border border-slate-700/50 rounded-xl p-5 hover:border-ninja-green/40 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-ninja-green/10 border border-ninja-green/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-ninja-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Military</p>
                    <p className="text-slate-300 text-xs font-medium leading-tight">{item.military}</p>
                  </div>
                </div>

                {/* Arrow connector */}
                <div className="flex items-center gap-2 my-3 pl-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-ninja-red/40 to-ninja-green/40" />
                  <ChevronRight className="w-4 h-4 text-ninja-green rotate-90" />
                  <div className="flex-1 h-px bg-gradient-to-l from-ninja-green/40 to-transparent" />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-ninja-red/10 border border-ninja-red/30 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-ninja-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-ninja-green uppercase tracking-wide font-semibold mb-0.5">Cybersecurity</p>
                    <p className="text-white text-xs font-bold leading-tight">{item.security}</p>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Core Values ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-ninja-red/5 via-ninja-surface/30 to-ninja-green/5 border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-ninja-green" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">Marine Corps Values, Applied</h3>
                <Star className="w-6 h-6 text-ninja-red" />
              </div>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                The three pillars of Marine Corps character — now the ethical foundation of every security engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-ninja-green/20 to-ninja-red/20 border border-slate-600/50 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-ninja-green" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{value.name}</h4>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs">
                      <span className="text-ninja-red font-semibold">Military: </span>{value.military}
                    </p>
                    <p className="text-slate-400 text-xs">
                      <span className="text-ninja-green font-semibold">Security: </span>{value.security}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}