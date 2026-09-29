import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { BookOpen, Eye, TrendingUp, Loader2, Heart, MessageCircle, Share2, MousePointerClick } from "lucide-react";

export default function BlogPerformanceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [blogPosts, socialPosts, analyticsEvents] = await Promise.all([
          base44.entities.BlogPost.list("-created_date", 500).catch(() => []),
          base44.entities.SocialPost.filter({ source_type: "blog" }, "-created_date", 500).catch(() => []),
          base44.entities.AnalyticsEvent.filter({ event_name: "page_view" }, "-created_date", 500).catch(() => []),
        ]);

        // Build blog post lookup map
        const postMap = {};
        blogPosts.forEach(p => {
          postMap[p.id] = {
            title: p.title,
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
            interactions: 0,
          };
        });

        // Count page views from analytics events on BlogPostDetail pages
        analyticsEvents.forEach(evt => {
          if (evt.page && evt.page.includes("BlogPostDetail")) {
            const queryStr = evt.page.split("?")[1] || "";
            const params = new URLSearchParams(queryStr);
            const id = params.get("id");
            if (id) {
              if (!postMap[id]) {
                postMap[id] = { title: "Unlinked Post", views: 0, likes: 0, comments: 0, shares: 0, clicks: 0, interactions: 0 };
              }
              postMap[id].views++;
            }
          }
        });

        // Aggregate social interactions by blog post source_id
        socialPosts.forEach(sp => {
          const id = sp.source_id;
          if (!id) return;
          if (!postMap[id]) {
            postMap[id] = { title: sp.source_title || "Unlinked Post", views: 0, likes: 0, comments: 0, shares: 0, clicks: 0, interactions: 0 };
          }
          if (sp.source_title) postMap[id].title = sp.source_title;
          postMap[id].likes += sp.likes || 0;
          postMap[id].comments += sp.comments || 0;
          postMap[id].shares += sp.shares || 0;
          postMap[id].clicks += sp.clicks || 0;
        });

        // Compute total interactions per post
        Object.values(postMap).forEach(v => {
          v.interactions = v.likes + v.comments + v.shares + v.clicks;
        });

        // Convert to array, filter posts with activity, sort by combined score, take top 10
        const chartData = Object.entries(postMap)
          .map(([id, v]) => ({
            id,
            title: v.title && v.title.length > 28 ? v.title.slice(0, 28) + "…" : (v.title || "Untitled"),
            views: v.views,
            interactions: v.interactions,
            likes: v.likes,
            comments: v.comments,
            shares: v.shares,
            clicks: v.clicks,
          }))
          .filter(d => d.views > 0 || d.interactions > 0)
          .sort((a, b) => (b.views + b.interactions) - (a.views + a.interactions))
          .slice(0, 10);

        setData(chartData);
      } catch {
        // errors bubble up
      }
      setLoading(false);
    };
    load();
  }, []);

  const totalViews = data.reduce((s, d) => s + d.views, 0);
  const totalInteractions = data.reduce((s, d) => s + d.interactions, 0);

  if (loading) return (
    <div className="h-32 flex items-center justify-center text-slate-500 text-sm">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading blog performance…
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-ninja-green to-emerald-600 rounded-lg flex items-center justify-center ninja-glow">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Top Blog Content</h2>
          <p className="text-slate-500 text-xs">Page views & social interactions by blog post</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
          <Eye className="w-5 h-5 text-ninja-green flex-shrink-0" />
          <div>
            <div className="text-xl font-bold text-white">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Total Page Views</div>
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
          <Heart className="w-5 h-5 text-pink-400 flex-shrink-0" />
          <div>
            <div className="text-xl font-bold text-white">{totalInteractions.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Social Interactions</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={Math.max(200, data.length * 42)}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                cursor={{ fill: "rgba(0,255,102,0.05)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="views" fill="#00ff66" radius={[0, 4, 4, 0]} name="Page Views" />
              <Bar dataKey="interactions" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Social Interactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10 text-slate-600 text-sm bg-slate-900/40 border border-slate-700/50 rounded-xl">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-700" />
          No blog performance data yet. Publish posts and share them on social media to see analytics here.
        </div>
      )}

      {/* Detail breakdown */}
      {data.length > 0 && (
        <div className="space-y-2">
          {data.slice(0, 5).map((d, i) => (
            <div key={d.id} className="flex items-center gap-3 bg-slate-900/40 border border-slate-700/40 rounded-lg px-4 py-2.5">
              <span className="text-slate-600 font-bold text-sm w-5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-sm font-medium truncate">{d.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-ninja-green" /> {d.views}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400" /> {d.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-blue-400" /> {d.comments}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-cyan-400" /> {d.shares}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3 text-green-400" /> {d.clicks}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-ninja-green font-bold text-sm">{(d.views + d.interactions).toLocaleString()}</div>
                <div className="text-slate-600 text-xs">total</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}