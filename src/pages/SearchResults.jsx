import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, BookOpen, Shield, ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const STATIC_PAGES = [
  { title: "About", excerpt: "Learn about Asaad Morman's background, military service, and cybersecurity journey.", path: "About", type: "page" },
  { title: "Services", excerpt: "Cybersecurity services including red team operations, penetration testing, security consulting and training.", path: "Services", type: "page" },
  { title: "Capability Statement", excerpt: "Comprehensive capability statement covering offensive security, tactical expertise, and business leadership.", path: "CapabilityStatement", type: "page" },
  { title: "Security Assessment", excerpt: "Free security risk assessment tool to evaluate your organization's cybersecurity posture.", path: "SecurityAssessment", type: "page" },
  { title: "Webinars", excerpt: "Live and recorded cybersecurity webinars on threat intelligence, red team tactics, and security architecture.", path: "Webinars", type: "page" },
  { title: "Executive Briefings", excerpt: "Private executive briefings on cybersecurity strategy for C-suite and board-level stakeholders.", path: "ExecutiveBriefings", type: "page" },
  { title: "Referral Program", excerpt: "Partner referral program for cybersecurity services.", path: "ReferralProgram", type: "page" },
  { title: "Books & Publications", excerpt: "Published books, whitepapers, and thought leadership articles on cybersecurity.", path: "Publications", type: "page" },
  { title: "Partners", excerpt: "Technology and consulting partners in the cybersecurity ecosystem.", path: "Partners", type: "page" },
  { title: "Contact", excerpt: "Get in touch for cybersecurity consulting, speaking engagements, or partnerships.", path: "Contact", type: "page" },
];

function highlight(text, query) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-cyan-400/30 text-cyan-300 rounded px-0.5">{part}</mark>
      : part
  );
}

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const run = async () => {
      setLoading(true);
      const q = query.toLowerCase();

      // Fetch dynamic content in parallel
      const [caseStudies, blogPosts] = await Promise.all([
        base44.entities.CaseStudy.list().catch(() => []),
        base44.entities.BlogPost.list().catch(() => []),
      ]);

      const found = [];

      // Case Studies
      caseStudies.forEach(cs => {
        const haystack = `${cs.title} ${cs.client} ${cs.challenge} ${cs.solution} ${cs.category} ${(cs.results || []).join(" ")}`.toLowerCase();
        if (haystack.includes(q)) {
          found.push({
            id: cs.id,
            title: cs.title,
            excerpt: cs.challenge?.slice(0, 150) + "...",
            type: "case-study",
            category: cs.category,
            path: `CaseStudyDetail?id=${cs.id}`,
          });
        }
      });

      // Blog Posts
      blogPosts.filter(p => p.published !== false).forEach(post => {
        const haystack = `${post.title} ${post.excerpt} ${post.content} ${post.category} ${(post.tags || []).join(" ")}`.toLowerCase();
        if (haystack.includes(q)) {
          found.push({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt?.slice(0, 150),
            type: "blog",
            category: post.category,
            path: `BlogPostDetail?id=${post.id}`,
          });
        }
      });

      // Static pages
      STATIC_PAGES.forEach(page => {
        const haystack = `${page.title} ${page.excerpt}`.toLowerCase();
        if (haystack.includes(q)) {
          found.push({ ...page });
        }
      });

      setResults(found);
      setLoading(false);
    };
    run();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      window.history.replaceState(null, "", `?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const typeConfig = {
    "case-study": { label: "Case Study", icon: Shield, color: "bg-red-500/20 text-red-300 border-red-500/30" },
    "blog": { label: "Blog Post", icon: BookOpen, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    "page": { label: "Page", icon: FileText, color: "bg-slate-500/20 text-slate-300 border-slate-600" },
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Search Results</h1>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search case studies, blog posts, pages..."
              className="pl-12 pr-4 py-4 text-lg bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 rounded-xl"
            />
          </form>
        </motion.div>

        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
        )}

        {!loading && query && (
          <div className="mb-6 text-slate-400 text-sm">
            {results.length > 0
              ? <>{results.length} result{results.length !== 1 ? "s" : ""} for <span className="text-cyan-300 font-semibold">"{query}"</span></>
              : <>No results for <span className="text-cyan-300 font-semibold">"{query}"</span></>
            }
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-slate-400">Try different keywords or browse the navigation above.</p>
          </div>
        )}

        {!loading && !query && (
          <div className="text-center py-16 text-slate-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p>Enter a search term above to find content across the site.</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, i) => {
            const cfg = typeConfig[result.type] || typeConfig["page"];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={`${result.type}-${result.id || result.path}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={createPageUrl(result.path)} onClick={() => window.scrollTo(0, 0)}>
                  <div className="bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 rounded-xl p-6 group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={`${cfg.color} border text-xs flex items-center gap-1`}>
                            <Icon className="w-3 h-3" /> {cfg.label}
                          </Badge>
                          {result.category && (
                            <Badge className="bg-slate-700/50 text-slate-400 border-slate-600 text-xs border">
                              {result.category.replace(/-/g, " ")}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                          {highlight(result.title, query)}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {highlight(result.excerpt, query)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}