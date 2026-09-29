import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { fetchSocialMetrics } from "@/functions/fetchSocialMetrics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Linkedin, Instagram, RefreshCw, Heart, MessageCircle, Share2, MousePointerClick, Eye, TrendingUp, ArrowUpDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, subMonths, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const PLATFORM_CONFIG = {
  linkedin: { label: "LinkedIn", color: "#0077B5", Icon: Linkedin, bg: "bg-[#0077B5]/10 border-[#0077B5]/30" },
  instagram: { label: "Instagram", color: "#E1306C", Icon: Instagram, bg: "bg-pink-500/10 border-pink-500/30" },
};

function MetricBadge({ icon: Icon, value, label, color }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="font-semibold text-white">{value ?? 0}</span>
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}

export default function SocialAnalytics() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest | engagement | likes | comments | shares | clicks
  const [dateRange, setDateRange] = useState("1month"); // all | 1month | 3months | 6months | custom

  const load = async () => {
    const all = await base44.entities.SocialPost.filter({ status: "published" });
    // Only LinkedIn and Instagram posts
    setPosts(all.filter(p => p.platform === "linkedin" || p.platform === "instagram").sort((a, b) => new Date(b.published_at || b.created_date) - new Date(a.published_at || a.created_date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSocialMetrics({});
    await load();
    setRefreshing(false);
  };

  // Apply date range filter
  const getDateThreshold = () => {
    const now = new Date();
    switch (dateRange) {
      case "1month": return subMonths(now, 1);
      case "3months": return subMonths(now, 3);
      case "6months": return subMonths(now, 6);
      case "all":
      default: return null;
    }
  };

  const dateThreshold = getDateThreshold();
  let filtered = activeTab === "all" ? posts : posts.filter(p => p.platform === activeTab);

  if (dateThreshold) {
    filtered = filtered.filter(p => {
      const postDate = new Date(p.published_at || p.created_date);
      return isAfter(postDate, dateThreshold);
    });
  }

  // Apply sorting
  const getSortedList = (list) => {
    const sorted = [...list];
    switch (sortBy) {
      case "likes":
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "comments":
        return sorted.sort((a, b) => (b.comments || 0) - (a.comments || 0));
      case "shares":
        return sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
      case "clicks":
        return sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case "engagement":
        return sorted.sort((a, b) => {
          const aEng = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
          const bEng = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
          return bEng - aEng;
        });
      case "newest":
      default:
        return sorted.sort((a, b) => new Date(b.published_at || b.created_date) - new Date(a.published_at || a.created_date));
    }
  };

  const sortedFiltered = getSortedList(filtered);

  // Chart data: top 8 posts by engagement
  const chartData = sortedFiltered
    .map(p => ({
      name: (p.source_title || p.content?.slice(0, 30) || "Post") + "...",
      likes: p.likes || 0,
      shares: p.shares || 0,
      clicks: p.clicks || 0,
      comments: p.comments || 0,
      platform: p.platform,
    }))
    .sort((a, b) => (b.likes + b.shares + b.clicks) - (a.likes + a.shares + a.clicks))
    .slice(0, 8);

  const totals = sortedFiltered.reduce((acc, p) => ({
    likes: acc.likes + (p.likes || 0),
    comments: acc.comments + (p.comments || 0),
    shares: acc.shares + (p.shares || 0),
    clicks: acc.clicks + (p.clicks || 0),
    impressions: acc.impressions + (p.impressions || 0),
  }), { likes: 0, comments: 0, shares: 0, clicks: 0, impressions: 0 });

  if (loading) return <div className="h-32 flex items-center justify-center text-slate-500 text-sm">Loading social analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Social Media Analytics</h2>
            <p className="text-slate-500 text-xs">LinkedIn & Instagram post performance</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}
          className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2 text-xs">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Metrics
        </Button>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1 w-fit">
        {[["all", "All Platforms"], ["linkedin", "LinkedIn"], ["instagram", "Instagram"]].map(([val, label]) => (
          <button key={val} onClick={() => setActiveTab(val)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === val ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Filters: Date Range & Sorting */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
            <option value="all">All Time</option>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
            <option value="newest">Newest First</option>
            <option value="engagement">Most Engagement</option>
            <option value="likes">Most Likes</option>
            <option value="comments">Most Comments</option>
            <option value="shares">Most Shares</option>
            <option value="clicks">Most Clicks</option>
          </select>
        </div>
      </div>

      {/* Totals row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Likes", value: totals.likes, icon: Heart, color: "text-pink-400" },
          { label: "Comments", value: totals.comments, icon: MessageCircle, color: "text-blue-400" },
          { label: "Shares", value: totals.shares, icon: Share2, color: "text-cyan-400" },
          { label: "Clicks", value: totals.clicks, icon: MousePointerClick, color: "text-green-400" },
          { label: "Impressions", value: totals.impressions, icon: Eye, color: "text-yellow-400" },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
              <div className="text-xl font-bold text-white">{m.value.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Posts by Engagement</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} name="Likes" />
              <Bar dataKey="shares" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Shares" />
              <Bar dataKey="clicks" fill="#22c55e" radius={[4, 4, 0, 0]} name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Post list */}
      <div className="space-y-3">
        {sortedFiltered.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">No posts found for the selected filters.</div>
        ) : sortedFiltered.map(post => {
          const cfg = PLATFORM_CONFIG[post.platform];
          const Icon = cfg.Icon;
          return (
            <div key={post.id} className={`bg-slate-900/60 border ${cfg.bg} rounded-xl p-4`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`} style={{ background: cfg.color + "22" }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className="text-xs" style={{ background: cfg.color + "33", color: cfg.color, border: "none" }}>{cfg.label}</Badge>
                    {post.source_title && <span className="text-slate-400 text-xs truncate">{post.source_title}</span>}
                    {post.published_at && (
                      <span className="text-slate-600 text-xs ml-auto">{format(new Date(post.published_at), "MMM d, yyyy")}</span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex flex-wrap gap-4">
                    <MetricBadge icon={Heart} value={post.likes} label="likes" color="text-pink-400" />
                    <MetricBadge icon={MessageCircle} value={post.comments} label="comments" color="text-blue-400" />
                    <MetricBadge icon={Share2} value={post.shares} label="shares" color="text-cyan-400" />
                    <MetricBadge icon={MousePointerClick} value={post.clicks} label="clicks" color="text-green-400" />
                    <MetricBadge icon={Eye} value={post.impressions} label="impressions" color="text-yellow-400" />
                  </div>
                  {post.metrics_updated_at && (
                    <p className="text-slate-600 text-xs mt-2">Last updated: {format(new Date(post.metrics_updated_at), "MMM d, h:mm a")}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}