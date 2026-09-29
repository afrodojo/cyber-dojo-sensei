import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Clock, Tag, Search, ChevronRight, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/seo/SEOHead";
import NewsletterSection from "../components/newsletter/NewsletterSection";

const CATEGORIES = [
  { value: "all", label: "All Posts" },
  { value: "red-team", label: "Red Team" },
  { value: "technical", label: "Technical" },
  { value: "leadership", label: "Leadership" },
  { value: "threat-intelligence", label: "Threat Intel" },
  { value: "architecture", label: "Architecture" },
  { value: "business", label: "Business" },
];

const categoryColors = {
  "red-team": "bg-red-500/20 text-red-300 border-red-500/30",
  "technical": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "leadership": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "threat-intelligence": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "architecture": "bg-green-500/20 text-green-300 border-green-500/30",
  "business": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await base44.entities.BlogPost.list("-created_date");
      setPosts(all.filter(p => p.published !== false));
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

  const featured = filtered.filter(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-6">
      <SEOHead
        title="Blog | Asaad Morman – Cybersecurity Insights"
        description="Expert insights on cybersecurity, red team operations, threat intelligence, and security leadership from Asaad Morman."
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
            Cybersecurity Insights
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6" />
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Expert perspectives on offensive security, threat intelligence, and enterprise defense strategies.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
            <p className="text-slate-400">Try a different search or category.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full inline-block"></span>
                  Featured Posts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map((post, i) => (
                    <PostCard key={post.id} post={post} featured index={i} />
                  ))}
                </div>
              </div>
            )}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full inline-block"></span>
                    All Posts
                  </h2>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {regular.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            <NewsletterSection variant="sidebar" source="blog-sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, featured = false, index = 0 }) {
  const colorClass = categoryColors[post.category] || "bg-slate-500/20 text-slate-300 border-slate-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link to={createPageUrl(`BlogPostDetail?id=${post.id}`)}>
        <Card className={`bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 h-full group cursor-pointer ${featured ? "border-cyan-500/30" : ""}`}>
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`${colorClass} text-xs border`}>
                {post.category?.replace(/-/g, " ")}
              </Badge>
              {featured && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs border">Featured</Badge>}
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors leading-tight line-clamp-2">
              {post.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
              {post.excerpt}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-full">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{post.read_time || "5 min read"}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium">
                Read More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}