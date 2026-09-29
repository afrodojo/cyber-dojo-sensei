import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Terminal, Clock, Tag, Search, Rss, ChevronRight, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import CyberDojoNav from "@/components/cyberdojo/CyberDojoNav";
import NewsletterSection from "@/components/newsletter/NewsletterSection";

const CATEGORIES = [
  { value: "all", label: "All Posts" },
  { value: "hands-on-tutorials", label: "Hands-on Tutorials" },
  { value: "writeups", label: "Writeups" },
  { value: "coding-projects", label: "Coding Projects" },
];

const categoryColors = {
  "hands-on-tutorials": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "writeups": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "coding-projects": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

export default function CyberDojoBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setSelectedId(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await base44.entities.BlogPost.list("-created_date", 50);
        const dojoCats = ["hands-on-tutorials", "writeups", "coding-projects"];
        setPosts(all.filter(p => p.published !== false && dojoCats.includes(p.category)));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const selected = selectedId ? posts.find(p => p.id === selectedId) : null;

  if (selected) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] text-slate-200">
        <CyberDojoNav />
        <article className="pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to blog
            </button>
            <span className={`inline-block text-[10px] font-mono uppercase tracking-wider border px-2 py-0.5 rounded mb-4 ${categoryColors[selected.category] || "border-slate-600 text-slate-300"}`}>
              {(selected.category || "post").replace(/-/g, " ")}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{selected.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 border-b border-slate-800 pb-6">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selected.read_time || "5 min read"}</span>
              {selected.tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selected.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 text-slate-500"><Tag className="w-3 h-3" />{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-code:text-emerald-300 prose-code:bg-slate-800/60 prose-code:rounded prose-code:px-1 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
              <ReactMarkdown>{selected.content || ""}</ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-200">
      <CyberDojoNav />

      <section className="pt-28 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-xs font-mono text-cyan-400 mb-5">
              <Terminal className="w-3.5 h-3.5" /> /tech-blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Tech Blog</h1>
            <p className="text-slate-400 max-w-2xl">
              Tutorials, security writeups, and coding projects — straight from the keyboard.
            </p>
            <div className="mt-4">
              <a href="/api/functions/rssFeed" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 text-xs font-mono text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                <Rss className="w-3.5 h-3.5" /> RSS Feed
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search posts, tags..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-gradient-to-r from-cyan-400 to-emerald-500 text-black"
                    : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-1">No posts found</h3>
              <p className="text-slate-500 text-sm">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
                >
                  <button
                    onClick={() => setSelectedId(post.id)}
                    className="block text-left w-full h-full rounded-xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all p-5 group"
                  >
                    <span className={`inline-block text-[10px] font-mono uppercase tracking-wider border px-2 py-0.5 rounded mb-3 ${categoryColors[post.category] || "border-slate-600 text-slate-300"}`}>
                      {(post.category || "post").replace(/-/g, " ")}
                    </span>
                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">
                            <Tag className="w-2.5 h-2.5" />{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="w-3 h-3" /> {post.read_time || "5 min read"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                        Read <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
          <NewsletterSection variant="full" source="cyber-dojo-blog" />
        </div>
      </section>
    </div>
  );
}