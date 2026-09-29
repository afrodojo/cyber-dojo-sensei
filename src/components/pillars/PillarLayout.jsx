import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo/SEOHead";

export default function PillarLayout({
  icon: Icon,
  title,
  tagline,
  description,
  accent = "cyan",
  routePath,
  seoTitle,
  seoDescription,
  children
}) {
  const accentMap = {
    cyan: {
      bg: "from-cyan-900/40 to-blue-900/20",
      icon: "from-cyan-500 to-blue-600",
      text: "text-cyan-400",
      border: "border-cyan-500/40",
      glow: "shadow-cyan-500/20"
    },
    emerald: {
      bg: "from-emerald-900/40 to-teal-900/20",
      icon: "from-emerald-500 to-teal-600",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      glow: "shadow-emerald-500/20"
    },
    purple: {
      bg: "from-purple-900/40 to-indigo-900/20",
      icon: "from-purple-500 to-indigo-600",
      text: "text-purple-400",
      border: "border-purple-500/40",
      glow: "shadow-purple-500/20"
    },
    amber: {
      bg: "from-amber-900/40 to-orange-900/20",
      icon: "from-amber-500 to-orange-600",
      text: "text-amber-400",
      border: "border-amber-500/40",
      glow: "shadow-amber-500/20"
    },
    indigo: {
      bg: "from-indigo-900/40 to-blue-900/20",
      icon: "from-indigo-500 to-blue-600",
      text: "text-indigo-400",
      border: "border-indigo-500/40",
      glow: "shadow-indigo-500/20"
    }
  };
  const a = accentMap[accent] || accentMap.cyan;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      <SEOHead title={seoTitle} description={seoDescription} />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${a.bg} border-b border-slate-800`}>
        <div className="absolute inset-0 ninja-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-cyan-400">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className={a.text}>{title}</span>
            </nav>
            <div className={`w-16 h-16 bg-gradient-to-br ${a.icon} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${a.glow}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{tagline}</h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">{description}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {children}
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Take the next step — reach out and let's discuss how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold">
              <Link to={createPageUrl("Contact")} onClick={() => window.scrollTo(0, 0)}>
                Get In Touch <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}