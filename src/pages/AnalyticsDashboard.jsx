import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, MousePointer, CheckCircle2, Globe, Smartphone, Monitor, Tablet, AlertTriangle, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const CONVERSIONS = {
  contact_form: "Contact Form",
  security_assessment: "Security Assessment",
  webinar_registration: "Webinar Registration",
  executive_briefing: "Executive Briefing",
  lead_form: "Lead Form",
  referral_form: "Referral Form",
  newsletter: "Newsletter Signup",
};

export default function AnalyticsDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useState(30); // days

  useEffect(() => {
    const init = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === "admin") {
          setIsAdmin(true);
          const all = await base44.entities.AnalyticsEvent.list("-timestamp", 2000);
          setEvents(all);
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

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

  // Filter by date range
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - dateRange);
  const filtered = events.filter(e => e.timestamp && new Date(e.timestamp) >= cutoff);

  // ── Derived Stats ──────────────────────────────────────────────────────────
  const pageViews = filtered.filter(e => e.event_name === "page_view");
  const clicks = filtered.filter(e => e.event_name === "click");
  const conversions = filtered.filter(e => e.event_name === "conversion");
  const uniqueSessions = new Set(filtered.map(e => e.session_id)).size;

  // Top pages
  const pageCounts = {};
  pageViews.forEach(e => {
    const p = e.page || "/";
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([page, views]) => ({ page, views }));

  // Traffic sources
  const sourceCounts = {};
  filtered.forEach(e => {
    const src = e.utm_source || (e.referrer === "direct" ? "direct" : new URL(e.referrer || "http://direct").hostname) || "direct";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const trafficSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([source, count]) => ({ source, count }));

  // Device breakdown
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  filtered.forEach(e => { if (e.device) deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1; });
  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

  // Daily page views (last N days)
  const dailyMap = {};
  for (let i = dateRange - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dailyMap[d.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
  }
  pageViews.forEach(e => {
    const d = new Date(e.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dailyMap[d] !== undefined) dailyMap[d]++;
  });
  const dailyData = Object.entries(dailyMap).map(([date, views]) => ({ date, views }));

  // Conversion breakdown
  const convMap = {};
  conversions.forEach(e => {
    const props = e.properties ? JSON.parse(e.properties) : {};
    const type = props.type || "other";
    convMap[type] = (convMap[type] || 0) + 1;
  });
  const convData = Object.entries(convMap).map(([type, count]) => ({ type: CONVERSIONS[type] || type, count }));

  // Export CSV
  const exportCSV = () => {
    const rows = [["Event", "Page", "Session", "Device", "Source", "UTM Campaign", "Timestamp"],
      ...filtered.map(e => [e.event_name, e.page, e.session_id, e.device, e.referrer, e.utm_campaign, e.timestamp])
    ];
    const csv = rows.map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "analytics.csv"; a.click();
  };

  const statCards = [
    { label: "Page Views", value: pageViews.length, icon: TrendingUp, color: "text-cyan-400" },
    { label: "Unique Sessions", value: uniqueSessions, icon: Users, color: "text-blue-400" },
    { label: "Clicks Tracked", value: clicks.length, icon: MousePointer, color: "text-purple-400" },
    { label: "Conversions", value: conversions.length, icon: CheckCircle2, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Analytics Dashboard
              </h1>
              <p className="text-slate-400 mt-1">User behavior, traffic sources & conversions</p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={dateRange}
                onChange={e => setDateRange(Number(e.target.value))}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg text-sm transition-all">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-5 flex items-center gap-3">
                  <s.icon className={`w-8 h-8 ${s.color} flex-shrink-0`} />
                  <div>
                    <p className="text-2xl font-bold text-white">{s.value.toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Daily Page Views Chart */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 bg-slate-800/30 border-slate-700/50">
            <CardHeader><CardTitle className="text-white text-base">Daily Page Views</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={Math.floor(dailyData.length / 6)} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardHeader><CardTitle className="text-white text-base">Device Breakdown</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 text-sm mt-2">
                {deviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-slate-300 capitalize">{d.name}</span>
                    <span className="text-slate-500">({d.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardHeader><CardTitle className="text-white text-base">Top Pages</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topPages} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis dataKey="page" type="category" tick={{ fill: "#94a3b8", fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", borderRadius: "8px" }} />
                  <Bar dataKey="views" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardHeader><CardTitle className="text-white text-base">Traffic Sources</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trafficSources} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis dataKey="source" type="category" tick={{ fill: "#94a3b8", fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Conversions */}
        {convData.length > 0 && (
          <Card className="bg-slate-800/30 border-slate-700/50 mb-6">
            <CardHeader><CardTitle className="text-white text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Conversion Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={convData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="type" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Events Table */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader><CardTitle className="text-white text-base">Recent Events</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400">
                    <th className="text-left px-6 py-3 font-medium">Event</th>
                    <th className="text-left px-6 py-3 font-medium">Page</th>
                    <th className="text-left px-6 py-3 font-medium">Device</th>
                    <th className="text-left px-6 py-3 font-medium">Source</th>
                    <th className="text-left px-6 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 30).map((e, i) => (
                    <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-3 text-cyan-400 font-mono text-xs">{e.event_name}</td>
                      <td className="px-6 py-3 text-slate-300 text-xs max-w-xs truncate">{e.page}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs capitalize">{e.device}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs">{e.utm_source || e.referrer || "direct"}</td>
                      <td className="px-6 py-3 text-slate-500 text-xs">{e.timestamp ? new Date(e.timestamp).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}