import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Github, GraduationCap, Terminal, ArrowRight, Shield, Bug, Code2, Clock, ChevronRight, Rss } from "lucide-react";
import CyberDojoNav from "@/components/cyberdojo/CyberDojoNav";
import NewsletterSection from "@/components/newsletter/NewsletterSection";

const ROLES = ["Security Engineer", "Researcher", "Mentor"];
const ACADEMIC_URL = "https://phdsensei.eds-360.com";
const GITHUB_URL = "https://github.com/afrodojo";

export default function CyberDojo() {
  const [posts, setPosts] = useState([]);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const all = await base44.entities.BlogPost.list("-created_date", 3);
        setPosts(all.filter(p => p.published !== false));
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    let roleIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const word = ROLES[roleIdx];
      if (!deleting) {
        setTyped(word.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === word.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        setTyped(word.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % ROLES.length; }
      }
      setTimeout(tick, deleting ? 45 : 90);
    };
    const t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-200 selection:bg-cyan-500/30">
      <CyberDojoNav />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }} />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-xs font-mono text-cyan-400 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Cyber Dojo Sensei // online
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-4"
          >
            afro<span className="text-cyan-400">dojo</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-mono text-lg sm:text-2xl text-slate-300 mb-3 h-9"
          >
            <span className="text-slate-500">&gt;_ </span>
            <span className="text-cyan-400">{typed}</span>
            <span className="terminal-cursor">▋</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed"
          >
            Hands-on offensive security research, practical writeups, and tooling —
            built from the trenches of AppSec, penetration testing, and secure scripting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-500 text-black font-semibold shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)] transition-all"
            >
              <Github className="w-5 h-5" /> View My GitHub
            </a>
            <a
              href={ACADEMIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-200 font-semibold hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
            >
              <GraduationCap className="w-5 h-5" /> Academic Site
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
          {[
            { icon: Bug, label: "Writeups", value: "CVD" },
            { icon: Shield, label: "Focus", value: "AppSec" },
            { icon: Code2, label: "Tooling", value: "Python" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-center"
            >
              <s.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="font-mono text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest posts */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" /> Latest from the dojo
              </h2>
              <p className="text-slate-500 text-sm">Fresh tutorials, writeups, and projects.</p>
            </div>
            <Link to="/cyber-dojo/blog" className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:gap-2 transition-all font-medium">
              All posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-500 text-sm">
              Posts loading — check the tech blog shortly.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to={`/cyber-dojo/blog?id=${post.id}`}
                    className="block h-full rounded-xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all p-5 group"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
                      {(post.category || "post").replace(/-/g, " ")}
                    </span>
                    <h3 className="text-base font-semibold text-white mt-2 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-3 h-3" /> {post.read_time || "5 min read"}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter + RSS */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <a
              href="/api/functions/rssFeed"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 text-xs font-mono text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              <Rss className="w-3.5 h-3.5" /> RSS Feed
            </a>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
            <NewsletterSection variant="full" source="cyber-dojo-home" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span className="font-mono">© 2026 afrodojo // cyber dojo sensei</span>
          <div className="flex items-center gap-5">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={ACADEMIC_URL} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Academic
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}