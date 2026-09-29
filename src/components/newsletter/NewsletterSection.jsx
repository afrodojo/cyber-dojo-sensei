import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2, Shield, Bell, BookOpen } from "lucide-react";
import { subscribeNewsletter } from "@/functions/subscribeNewsletter";

export default function NewsletterSection({ variant = "footer", source = "footer" }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    const res = await subscribeNewsletter({ email: email.trim(), name: name.trim(), source });
    if (res.data?.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  // ── Sidebar variant ──────────────────────────────────────────────────────
  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-cyan-950/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white font-bold text-sm">Sentinel Intel Feed</h3>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed mb-4">
          Get threat briefings, red team insights & Sentinel Ecosystem research delivered directly to your inbox.
        </p>
        {status === "success" ? (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 text-green-400 text-sm p-3 bg-green-950/30 border border-green-500/30 rounded-xl">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>You're in! Check your inbox for a welcome email.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center"
              >
                {status === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
          </form>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {["Threat Intel", "Red Team", "AI Security"].map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  // ── Full / Footer variant ────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-blue-950/20 overflow-hidden px-6 py-10 md:px-12 text-center"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300 text-xs font-semibold">Sentinel Intel Feed</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Stay Ahead of Every Threat
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mb-6">
          Join thousands of security professionals receiving weekly threat briefings, red team insights, and exclusive Sentinel Ecosystem research from Asaad Morman.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: Bell,     label: "Weekly Threat Briefings" },
            { icon: Shield,   label: "Red Team Insights" },
            { icon: BookOpen, label: "Research Previews" },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-1.5 text-slate-400 text-xs">
              <p.icon className="w-3.5 h-3.5 text-cyan-400" />
              {p.label}
            </div>
          ))}
        </div>

        {status === "success" ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 bg-green-950/40 border border-green-500/30 rounded-xl px-6 py-4 text-green-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold text-sm">You're subscribed!</div>
              <div className="text-xs text-green-400/70">Check your inbox for a welcome email.</div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 justify-center whitespace-nowrap"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Subscribe Free
            </button>
          </form>
        )}
        {errorMsg && <p className="text-red-400 text-xs mt-3">{errorMsg}</p>}
        <p className="text-slate-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </motion.div>
  );
}