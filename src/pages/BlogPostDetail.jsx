import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Clock, Tag, BookOpen, ChevronRight, Share2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import SEOHead from "../components/seo/SEOHead";

const categoryColors = {
  "red-team": "from-red-500 to-pink-600",
  "technical": "from-blue-500 to-cyan-600",
  "leadership": "from-purple-500 to-indigo-600",
  "threat-intelligence": "from-orange-500 to-amber-600",
  "architecture": "from-green-500 to-emerald-600",
  "business": "from-cyan-500 to-blue-600",
};

export default function BlogPostDetail() {
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const all = await base44.entities.BlogPost.list("-created_date");
      const current = all.find(p => p.id === id);
      setPost(current || null);
      if (current) {
        const rel = all.filter(p => p.id !== id && p.category === current.category && p.published !== false).slice(0, 3);
        setRelated(rel);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
        <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600">
          <Link to={createPageUrl("Blog")}>Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const gradient = categoryColors[post.category] || "from-cyan-500 to-blue-600";

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-6">
      <SEOHead
        title={post.meta_title || `${post.title} | Asaad Morman`}
        description={post.meta_description || post.excerpt}
        type="article"
        blogPost={post}
      />
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Link to={createPageUrl("Blog")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`bg-gradient-to-r ${gradient} rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-white/20 text-white border-0">
                {post.category?.replace(/-/g, " ")}
              </Badge>
              {post.featured && <Badge className="bg-yellow-500/90 text-yellow-900 border-0">Featured</Badge>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <p className="text-white/80 text-lg mb-6">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Asaad Morman</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time || "5 min read"}</span>
              </div>
              <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-sm text-slate-400 bg-slate-800/50 border border-slate-700 px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8 md:p-10">
              <div className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-cyan-300 prose-code:bg-slate-700/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
                prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400
                prose-li:text-slate-300
                prose-hr:border-slate-700
              ">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className={`bg-gradient-to-r ${gradient} border-0`}>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Want Expert Cybersecurity Guidance?</h3>
              <p className="text-white/80 mb-6">Let's discuss your security challenges and how I can help protect your organization.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-white text-slate-900 font-bold hover:bg-slate-100">
                  <Link to={createPageUrl("Contact")}>Request a Consultation</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  <Link to={createPageUrl("Blog")}>More Articles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Posts */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(rel => {
                const relGrad = categoryColors[rel.category] || "from-cyan-500 to-blue-600";
                return (
                  <Link key={rel.id} to={createPageUrl(`BlogPostDetail?id=${rel.id}`)}>
                    <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 h-full group cursor-pointer">
                      <CardContent className="p-0">
                        <div className={`bg-gradient-to-r ${relGrad} p-4 rounded-t-lg`}>
                          <Badge className="bg-white/20 text-white border-0 text-xs">
                            {rel.category?.replace(/-/g, " ")}
                          </Badge>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-tight line-clamp-2">{rel.title}</h3>
                          <p className="text-slate-400 text-sm line-clamp-2 mb-3">{rel.excerpt}</p>
                          <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium">
                            Read More <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}