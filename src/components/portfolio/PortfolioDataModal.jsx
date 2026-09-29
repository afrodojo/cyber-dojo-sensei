import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, BookOpen, Volume2, FlaskConical, ExternalLink, RotateCcw } from "lucide-react";
import { getAnalytics, resetAnalytics } from "@/lib/stealthAnalytics";

export default function PortfolioDataModal({ open, onClose }) {
  const [data, setData] = useState({});

  useEffect(() => {
    if (open) setData(getAnalytics());
  }, [open]);

  const handleReset = () => {
    resetAnalytics();
    setData({});
  };

  const stats = [
    { key: "publication_expand", label: "Publication Expansions", icon: BookOpen, description: "Times visitors expanded a book or publication abstract." },
    { key: "audio_toggle", label: "Audio Toggles", icon: Volume2, description: "Times visitors toggled the stealth mode audio." },
    { key: "research_lab_click", label: "Research Lab Clicks", icon: FlaskConical, description: "Times visitors entered the PhD research portal." },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-ninja-surface border border-ninja-green/30 rounded-2xl shadow-2xl ninja-glow"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ninja-green/10 border border-ninja-green/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-ninja-green" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Portfolio Engagement Data</h3>
                  <p className="text-xs text-slate-400">Stealth analytics from your interactions</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {stats.map((stat) => {
                const count = data[stat.key] || 0;
                return (
                  <div key={stat.key} className="flex items-start gap-4 p-4 bg-ninja-void/50 border border-slate-700/40 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-ninja-green/10 border border-ninja-green/20 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-ninja-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{stat.label}</span>
                        <span className="text-2xl font-bold text-ninja-green tabular-nums">{count}</span>
                      </div>
                      <p className="text-xs text-slate-400">{stat.description}</p>
                    </div>
                  </div>
                );
              })}

              {data.lastActivity && (
                <p className="text-xs text-slate-500 text-center">
                  Last activity: {new Date(data.lastActivity).toLocaleString()}
                </p>
              )}
            </div>

            <div className="p-6 border-t border-slate-700/50 flex flex-col gap-3">
              <a
                href="https://phdsensei.eds-360.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-ninja-green/10 border border-ninja-green/40 text-ninja-green hover:bg-ninja-green/20 font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                <FlaskConical className="w-4 h-4" />
                View Analytics Discussions on PhD Sensei
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-ninja-red transition-colors text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset engagement data
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}