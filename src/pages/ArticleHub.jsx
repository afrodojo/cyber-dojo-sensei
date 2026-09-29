import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Upload, FileText, Bot, CheckCircle2, Clock, XCircle, AlertTriangle,
  Loader2, RefreshCw, Linkedin, Twitter, Instagram, Trash2, Eye,
  Send, Plus, ChevronDown, ChevronUp, Sparkles, BookOpen, X, CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { processArticleSubmission } from "@/functions/processArticleSubmission";
import ArticleUploader from "@/components/articles/ArticleUploader";
import ArticleReviewCard from "@/components/articles/ArticleReviewCard";
import AgentArticleChat from "@/components/articles/AgentArticleChat";
import PublishingCalendar from "@/components/articles/PublishingCalendar";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const TABS = [
  { id: "upload", label: "📎 Upload Article" },
  { id: "pending", label: "⏳ Pending Review" },
  { id: "approved", label: "✅ Approved" },
  { id: "agent", label: "🤖 AI Writer" },
  { id: "calendar", label: "📅 Schedule" },
];

export default function ArticleHub() {
  const { isAdmin, loading } = useAdminAccess();
  const [activeTab, setActiveTab] = useState("upload");
  const [articles, setArticles] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (isAdmin) {
        try {
          await loadArticles();
        } catch {}
      }
    };
    init();
  }, [isAdmin]);

  const loadArticles = async () => {
    const [all, posts] = await Promise.all([
      base44.entities.ArticleSubmission.list("-created_date", 50),
      base44.entities.SocialPost.list("-created_date", 100),
    ]);
    setArticles(all);
    setSocialPosts(posts);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="text-center p-8 bg-slate-900 rounded-lg border border-red-500/30">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400">Admin access required.</p>
      </div>
    </div>
  );

  const pending = articles.filter(a => a.status === "pending");
  const approved = articles.filter(a => a.status === "approved");
  const published = articles.filter(a => a.status === "published");

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Article & Content Hub
              </h1>
              <p className="text-slate-400 mt-1">Upload articles, review AI-generated content, post to social media</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Articles", value: articles.length, color: "text-white" },
            { label: "Pending Review", value: pending.length, color: "text-yellow-400" },
            { label: "Approved", value: approved.length, color: "text-green-400" },
            { label: "Published", value: published.length, color: "text-cyan-400" },
          ].map(stat => (
            <Card key={stat.label} className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.id === "pending" ? `⏳ Pending (${pending.length})` : tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ArticleUploader onSubmitted={() => { loadArticles(); setActiveTab("pending"); }} />
            </motion.div>
          )}

          {activeTab === "pending" && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {pending.length === 0 ? (
                <div className="text-center py-20 text-slate-600">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium">No articles pending review</p>
                  <p className="text-sm mt-1">Upload an article or have the AI agent write one</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pending.map(article => (
                    <ArticleReviewCard key={article.id} article={article} onUpdate={loadArticles} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "approved" && (
            <motion.div key="approved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...approved, ...published].length === 0 ? (
                <div className="text-center py-20 text-slate-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium">No approved articles yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...approved, ...published].map(article => (
                    <ArticleReviewCard key={article.id} article={article} onUpdate={loadArticles} readOnly />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "agent" && (
            <motion.div key="agent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AgentArticleChat onArticleCreated={() => { loadArticles(); setActiveTab("pending"); }} />
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarDays className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Publishing Schedule</h2>
                  <span className="text-slate-500 text-sm">· articles & social posts</span>
                </div>
                <PublishingCalendar articles={articles} socialPosts={socialPosts} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}