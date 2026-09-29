import React from "react";
import { motion } from "framer-motion";
import { Microscope, ExternalLink } from "lucide-react";
import { PHD_SENSEI_URL } from "@/lib/routes";

const accentThemes = {
  purple: {
    bg: "from-purple-900/30 to-indigo-900/20",
    icon: "from-purple-500 to-indigo-600",
    text: "text-purple-400",
    border: "border-purple-500/30 hover:border-purple-500/50",
    btn: "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
  },
  emerald: {
    bg: "from-emerald-900/30 to-teal-900/20",
    icon: "from-emerald-500 to-teal-600",
    text: "text-emerald-400",
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    btn: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
  },
  indigo: {
    bg: "from-indigo-900/30 to-blue-900/20",
    icon: "from-indigo-500 to-blue-600",
    text: "text-indigo-400",
    border: "border-indigo-500/30 hover:border-indigo-500/50",
    btn: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
  }
};

export default function PhDSenseiCard({ accent = "indigo" }) {
  const a = accentThemes[accent] || accentThemes.indigo;

  return (
    <motion.a
      href={PHD_SENSEI_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`block bg-gradient-to-br ${a.bg} border ${a.border} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg mb-8`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className={`w-16 h-16 shrink-0 bg-gradient-to-br ${a.icon} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Microscope className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${a.text} mb-1 block`}>
            Sister Platform
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Advanced Academic Research &amp; PhD Pathways
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Access PhD Sensei — our dedicated research platform for doctoral funding discovery,
            academic career resources, and AI-powered grant intelligence in cybersecurity and defense.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-2 px-5 py-2.5 ${a.btn} text-white text-sm font-semibold rounded-lg transition-all`}>
            Launch Platform
            <ExternalLink className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}