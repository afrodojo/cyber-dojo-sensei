import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Scale, CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

const TOPICS = [
  { id: "cybersecurity", label: "Cybersecurity Law & Policy", icon: Shield, color: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/10" },
  { id: "2a_law", label: "2A & Firearms Legislation", icon: Scale, color: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10" },
];

export default function LegislativeAlertSignup({ variant = "full" }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState(["cybersecurity", "2a_law"]);
  const [states, setStates] = useState(["VA"]);
  const [showStates, setShowStates] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const toggleInterest = (id) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleState = (s) => {
    setStates(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || interests.length === 0) return;
    setStatus("loading");
    try {
      await base44.entities.LegislativeSubscriber.create({
        email,
        name,
        interests,
        states,
        active: true
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center"
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">You're Subscribed!</h3>
        <p className="text-slate-400 text-sm">Weekly alerts will be sent to <span className="text-green-400">{email}</span>. Stay informed on the laws that matter.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Legislative Alert Subscriptions</h3>
          <p className="text-slate-400 text-sm">Weekly email summaries of cybersecurity policy & 2A law changes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none text-sm"
          />
          <input
            type="email"
            placeholder="Your email address *"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none text-sm"
          />
        </div>

        {/* Topics */}
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Alert Topics</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {TOPICS.map(({ id, label, icon: Icon, color, border, bg }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${interests.includes(id) ? `${bg} ${border}` : "border-slate-700/50 bg-slate-800/30"}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${interests.includes(id) ? color : "text-slate-500"}`} />
                <span className={`text-sm font-medium ${interests.includes(id) ? "text-white" : "text-slate-400"}`}>{label}</span>
                {interests.includes(id) && <CheckCircle className={`w-4 h-4 ml-auto flex-shrink-0 ${color}`} />}
              </button>
            ))}
          </div>
        </div>

        {/* States (only if 2a_law selected) */}
        {interests.includes("2a_law") && (
          <div>
            <button
              type="button"
              onClick={() => setShowStates(v => !v)}
              className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 hover:text-white transition-colors"
            >
              Monitor States ({states.length} selected)
              {showStates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showStates && (
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {US_STATES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleState(s)}
                    className={`text-xs px-2 py-1 rounded-md border transition-all ${states.includes(s) ? "bg-orange-500/20 border-orange-500/50 text-orange-300" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={status === "loading" || interests.length === 0 || !email}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold disabled:opacity-50"
        >
          {status === "loading" ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subscribing...</>
          ) : (
            <><Bell className="w-4 h-4 mr-2" /> Subscribe to Weekly Alerts</>
          )}
        </Button>

        {status === "error" && (
          <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
        )}

        <p className="text-slate-500 text-xs text-center">Weekly digest every Monday. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}