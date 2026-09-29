import React from "react";
import { motion } from "framer-motion";
import SentinelInquiryForm from "./SentinelInquiryForm";
import { Shield, Cpu, Eye, Database, FlaskConical, Swords, CheckCircle, BookOpen, Layers } from "lucide-react";

const pillars = [
  {
    id: "outpost-zero",
    name: "Outpost Zero",
    subtitle: "Self-Healing SIEM",
    icon: Shield,
    gradient: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
    accent: "text-cyan-400",
    iconGradient: "from-cyan-500 to-blue-600",
    description:
      "An autonomous Security Information and Event Management platform powered by generative AI that detects, triages, and self-remediates threats in real time—eliminating analyst fatigue and reducing mean time to respond.",
    features: [
      "Autonomous threat triage & remediation",
      "Generative AI-driven alert correlation",
      "Self-healing playbook execution",
      "Zero-touch incident resolution"
    ]
  },
  {
    id: "izulu-sentinel",
    name: "Izulu Sentinel",
    subtitle: "Physical-Digital Bridge",
    icon: Eye,
    gradient: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    accent: "text-violet-400",
    iconGradient: "from-violet-500 to-purple-600",
    description:
      "A hyper-convergence layer that fuses physical security signals—CCTV, access control, IoT sensors—with digital threat intelligence to provide a unified operational picture across both domains simultaneously.",
    features: [
      "Physical-digital threat correlation",
      "IoT & sensor data fusion",
      "Unified security operations picture",
      "Predictive behavioral analytics"
    ]
  },
  {
    id: "asosint",
    name: "ASOSINT",
    subtitle: "Edge-Computed OSINT",
    icon: Cpu,
    gradient: "from-emerald-500/20 to-teal-600/20",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    accent: "text-emerald-400",
    iconGradient: "from-emerald-500 to-teal-600",
    description:
      "Autonomous Surface & Open-Source Intelligence engine that harvests, enriches, and analyzes open-source data at the edge—delivering actionable adversary profiling and attack surface mapping without cloud dependency.",
    features: [
      "Edge-native OSINT collection",
      "Adversary profiling via ML",
      "Attack surface mapping",
      "Real-time dark web monitoring"
    ]
  }
];

const phases = [
  {
    number: "01",
    title: "Data Fusion & Ingestion",
    icon: Database,
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    description:
      "Multi-source data ingestion from physical sensors, digital endpoints, open-source feeds, and threat intelligence platforms. Normalization and correlation across heterogeneous data streams."
  },
  {
    number: "02",
    title: "Generative AI Modeling",
    icon: Layers,
    color: "text-violet-400",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    description:
      "Large language model fine-tuning on cyber-threat ontologies. Transformer-based architectures for anomaly detection, alert synthesis, and autonomous decision generation."
  },
  {
    number: "03",
    title: "Autonomous Response Engine",
    icon: FlaskConical,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    description:
      "Reinforcement learning-driven response orchestration. Self-healing playbooks, adaptive countermeasures, and closed-loop feedback mechanisms that improve with each incident."
  },
  {
    number: "04",
    title: "Red Team Validation",
    icon: Swords,
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    description:
      "Adversarial testing against the full Sentinel Ecosystem under realistic attack scenarios. Measures evasion resistance, detection latency, and response accuracy against nation-state TTPs."
  }
];

export default function SentinelResearch() {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-500/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-medium text-sm">PhD Dissertation Research</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight pb-2">
          The Sentinel Ecosystem
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-2">
          Autonomous Hyper-Convergence of Generative AI and Machine Learning
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-6" />
      </motion.div>

      {/* Core Research Pillars */}
      <div className="grid lg:grid-cols-3 gap-6 mb-24">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div
                className={`relative h-full rounded-2xl border ${pillar.border} bg-gradient-to-br ${pillar.gradient} backdrop-blur-md p-8 shadow-xl ${pillar.glow} hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
              >
                {/* Glass sheen */}
                <div className="absolute inset-0 rounded-2xl bg-white/[0.03] pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className={`w-14 h-14 bg-gradient-to-br ${pillar.iconGradient} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className={`text-2xl font-bold text-white mb-1 group-hover:${pillar.accent} transition-colors`}>
                  {pillar.name}
                </h3>
                <p className={`text-sm font-semibold ${pillar.accent} mb-4 uppercase tracking-wide`}>
                  {pillar.subtitle}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>

                <ul className="space-y-2">
                  {pillar.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${pillar.accent}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4-Phase Methodology */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          4-Phase Dissertation Methodology
        </h3>
        <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 mx-auto mb-4" />
        <p className="text-slate-400 max-w-2xl mx-auto">
          A rigorous empirical framework spanning data fusion, AI modeling, autonomous response, and adversarial Red Team validation.
        </p>
      </motion.div>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-red-500/30" style={{ top: '2.5rem' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div className={`relative rounded-xl border ${phase.border} ${phase.bg} backdrop-blur-sm p-6 h-full`}>
                  {/* Phase number bubble */}
                  <div className={`relative w-12 h-12 rounded-full border-2 ${phase.border} flex items-center justify-center mb-5 bg-slate-950 mx-auto lg:mx-0 z-10`}>
                    <span className={`font-bold text-sm ${phase.color}`}>{phase.number}</span>
                  </div>

                  <Icon className={`w-5 h-5 ${phase.color} mb-3`} />
                  <h4 className="text-white font-bold text-base mb-2">{phase.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{phase.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <SentinelInquiryForm />
    </div>
  );
}