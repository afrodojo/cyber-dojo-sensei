import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Shield, Lock, FileText, Leaf, Crosshair, Eye, Zap, ChevronDown, ChevronUp, Code2, Cpu, Users } from "lucide-react";

const tools = [
  {
    name: "Thyreos",
    tagline: "Offensive Threat Intelligence Platform.",
    description: "EDS-built platform for adversary tracking, OSINT collection, and offensive threat intelligence operations.",
    url: "https://thyreos.eds-360.com",
    icon: Crosshair,
    gradient: "from-red-600 to-rose-700",
    border: "border-red-500/30",
    glow: "hover:shadow-red-500/20",
    badge: "Threat Intel",
    authorNote: "Conceived, designed, and built by Asaad Morman as part of the EDS offensive security toolkit. Thyreos was developed from operational gaps identified during real red team engagements — combining OSINT automation, adversary profiling, and live threat tracking into a single unified platform.",
    features: [
      "Automated OSINT collection across open and dark web sources",
      "Adversary profile building and attribution mapping",
      "Real-time threat indicator aggregation",
      "Custom reporting engine for client deliverables",
    ],
    builtWith: ["Python", "React", "MITRE ATT&CK", "Shodan API", "Custom ML pipelines"],
    role: "Sole Author & Architect",
  },
  {
    name: "EDS Sentrix ASM",
    tagline: "Attack Surface Management.",
    description: "Continuous external attack surface monitoring, asset discovery, and exposure management for enterprise environments.",
    url: "https://sentrixasm.eds-360.com",
    icon: Eye,
    gradient: "from-cyan-600 to-sky-700",
    border: "border-cyan-500/30",
    glow: "hover:shadow-cyan-500/20",
    badge: "ASM",
    authorNote: "Authored and architected by Asaad Morman to solve a critical need: organizations didn't know what was exposed on the internet until after a breach. Sentrix ASM provides continuous discovery and risk scoring — built from lessons learned across dozens of penetration testing engagements.",
    features: [
      "Continuous external asset discovery and inventory",
      "Automated exposure and misconfiguration detection",
      "Risk-scored findings with remediation guidance",
      "Integration with existing SOC/SIEM workflows",
    ],
    builtWith: ["Go", "React", "Censys API", "Nuclei", "PostgreSQL"],
    role: "Sole Author & Architect",
  },
  {
    name: "ASHE",
    tagline: "Automated Security & Hardening Engine.",
    description: "EDS-built automated hardening and compliance engine for rapid security posture improvements across hybrid environments.",
    url: "https://ashe.eds-360.com",
    icon: Zap,
    gradient: "from-violet-600 to-purple-700",
    border: "border-violet-500/30",
    glow: "hover:shadow-violet-500/20",
    badge: "Hardening",
    authorNote: "Designed and authored by Asaad Morman after observing that most organizations failed not from lack of knowledge, but lack of automation. ASHE was built to close that gap — translating compliance frameworks like NIST, CIS, and STIG into executable, repeatable hardening playbooks.",
    features: [
      "Automated baseline hardening for Windows, Linux, and macOS",
      "CIS Benchmarks, NIST 800-53, and STIG compliance mapping",
      "Drift detection and remediation scheduling",
      "Audit-ready reporting for regulatory requirements",
    ],
    builtWith: ["Ansible", "Python", "React", "NIST 800-53", "CIS Benchmarks"],
    role: "Sole Author & Architect",
  },
];

const divisions = [
  {
    name: "EDS Defense",
    tagline: "Protecting People. Training Warriors.",
    description: "Firearms instruction, CPR/AED, Executive Protection, and Drone Operations.",
    url: "https://defense.eds-360.com",
    icon: Shield,
    gradient: "from-red-600 to-orange-600",
    border: "border-red-500/30",
    glow: "hover:shadow-red-500/20",
    badge: "Defensive Training"
  },
  {
    name: "EDS Cyber",
    tagline: "Securing the Digital Frontier.",
    description: "Cybersecurity consulting, penetration testing, IT solutions, and red team operations.",
    url: "https://cyber.eds-360.com",
    icon: Lock,
    gradient: "from-cyan-600 to-blue-600",
    border: "border-cyan-500/30",
    glow: "hover:shadow-cyan-500/20",
    badge: "Cybersecurity"
  },
  {
    name: "EDS Notary & Process",
    tagline: "Mobile. Professional. Reliable.",
    description: "Mobile notary services and process serving across Virginia with precision and care.",
    url: "https://nps.eds-360.com",
    icon: FileText,
    gradient: "from-purple-600 to-indigo-600",
    border: "border-purple-500/30",
    glow: "hover:shadow-purple-500/20",
    badge: "Legal Services"
  },
  {
    name: "Mow Dojo",
    tagline: "Precision Cuts. Warrior Results.",
    description: "Veteran-owned lawn care and home services delivering elite property maintenance.",
    url: "https://mowdojo.eds-360.com",
    icon: Leaf,
    gradient: "from-green-600 to-emerald-600",
    border: "border-green-500/30",
    glow: "hover:shadow-green-500/20",
    badge: "Property Services"
  }
];

const ToolCard = ({ tool, index }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = tool.icon;
  return (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group relative flex flex-col bg-slate-900/60 border ${tool.border} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${tool.glow}`}
    >
      {/* Top card content */}
      <div className="p-6 flex flex-col flex-1">
        <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${tool.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500`} />

        {/* Author badge */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-2.5 py-1">
            <Code2 className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">Authored by Asaad Morman</span>
          </div>
        </div>

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${tool.gradient} text-white mb-3`}>
          {tool.badge}
        </span>

        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{tool.name}</h3>
        <p className="text-xs font-medium text-slate-300 mb-2 italic">{tool.tagline}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>

        {/* Role pill */}
        <div className="flex items-center gap-1.5 mt-3">
          <Users className="w-3 h-3 text-slate-500" />
          <span className="text-[11px] text-slate-500 font-medium">{tool.role}</span>
        </div>
      </div>

      {/* Expandable section */}
      <div className="border-t border-slate-700/50">
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-between px-6 py-3 text-xs font-semibold text-cyan-400 hover:bg-slate-800/50 transition-colors"
        >
          <span>{expanded ? "Hide Details" : "Learn More — How I Built This"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4">
                {/* Author note */}
                <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-cyan-500/50 pl-3">
                  {tool.authorNote}
                </p>

                {/* Key Features */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Key Features</p>
                  <ul className="space-y-1.5">
                    {tool.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-cyan-400 mt-0.5">▸</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Built With */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Built With</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.builtWith.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visit link */}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Visit Live Tool <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visit link when collapsed */}
        {!expanded && (
          <div className="px-6 pb-4">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Visit Tool <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function EDSDivisionsGrid() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-2 mb-5">
            <span className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">EDS Universe</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Explore Our Divisions & Tools
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6" />
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Emerging Defense Solutions operates specialized divisions and proprietary security tools — each built to serve, protect, and empower.
          </p>
        </motion.div>

        {/* Proprietary Tools */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 px-2">Proprietary Security Tools</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {tools.map((tool, index) => (
              <ToolCard key={tool.name} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-2">Business Divisions</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((div, index) => {
            const Icon = div.icon;
            return (
              <motion.a
                key={div.name}
                href={div.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col bg-slate-900/60 border ${div.border} rounded-2xl p-7 hover:shadow-2xl ${div.glow} transition-all duration-300 overflow-hidden`}
              >
                {/* Background gradient blob */}
                <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${div.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${div.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Badge */}
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${div.gradient} text-white mb-3`}>
                  {div.badge}
                </span>

                {/* Text */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {div.name}
                </h3>
                <p className="text-sm font-medium text-slate-300 mb-2 italic">
                  {div.tagline}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">
                  {div.description}
                </p>

                {/* Visit link */}
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span>Visit Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}