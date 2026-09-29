import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Radio, BookOpen, PlayCircle, Library, FileText, Lock, ArrowRight, Star, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ensureMasterAdmin } from "@/functions/ensureMasterAdmin";

const perks = [
  { icon: FileText, label: "Early Research Access", desc: "Get cutting-edge cybersecurity research before public release" },
  { icon: BookOpen, label: "Exclusive Blog Posts", desc: "In-depth articles from industry experts and field operators" },
  { icon: PlayCircle, label: "Video Content", desc: "Training videos, interviews, and tactical breakdowns" },
  { icon: Library, label: "Resource Library", desc: "Tools, templates, threat assessments & more" },
];

export default function SignIn() {
  useEffect(() => {
    // Auto-redirect based on role if already authenticated
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) return;
      try {
        // Master admin override: promote before deciding redirect target
        try { await ensureMasterAdmin({}); } catch {}
        const user = await base44.auth.me();
        if (user?.role === 'admin') {
          window.location.href = "/AdminDashboard";
        } else {
          window.location.href = "/MemberPortal";
        }
      } catch {
        window.location.href = "/MemberPortal";
      }
    });
  }, []);

  const handleSignIn = () => {
    // Redirect through SignIn so the master admin check runs after platform auth
    base44.auth.redirectToLogin('/SignIn');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">

      {/* Left Panel — Branding */}
      <div className="relative lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-black flex flex-col justify-between p-8 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Asaad Morman</h1>
              <p className="text-xs text-slate-400">Cybersecurity Entrepreneur</p>
            </div>
          </div>
        </div>

        {/* Podcast Badge */}
        <div className="relative z-10 my-8 lg:my-0 lg:flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full px-4 py-1.5 text-xs font-semibold mb-5 w-fit">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Shield and Signal Podcast
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            Your Early Access<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Community Portal
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
            Sign in to unlock exclusive research, insights, and resources curated for cybersecurity professionals and enthusiasts.
          </p>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {perks.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-xl p-3.5">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial blurb */}
        <div className="relative z-10 hidden lg:flex items-start gap-3 mt-8 bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-400 text-xs italic">
            "The Shield and Signal research library alone is worth the sign-up. Asaad delivers operator-level insight you won't find anywhere else."
          </p>
        </div>
      </div>

      {/* Right Panel — Sign In */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Headline */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to access your early-access member portal</p>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] text-base"
          >
            <ShieldCheck className="w-5 h-5" />
            Sign In / Create Account
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs">Members get full access</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Feature highlights */}
          <div className="space-y-3">
            {[
              { icon: Zap, text: "Instant access to the Shield & Signal research library" },
              { icon: BookOpen, text: "New blogs and video drops before the general public" },
              { icon: Library, text: "Free security templates & threat assessment tools" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-cyan-400" />
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-600 text-xs mt-10">
            By signing in, you agree to our{" "}
            <a href="/TermsOfUse" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Use</a>
            {" "}and{" "}
            <a href="/PrivacyPolicy" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}