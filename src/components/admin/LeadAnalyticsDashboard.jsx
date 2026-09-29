import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { Loader2, TrendingUp, Building2, Users, Target } from "lucide-react";

const INDUSTRY_COLORS = [
  "#00f2ff", "#3b82f6", "#a855f7", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#84cc16", "#06b6d4", "#8b5cf6", "#f97316", "#64748b"
];
const AUDIENCE_COLORS = ["#00f2ff", "#3b82f6", "#a855f7", "#f59e0b"];

const INDUSTRY_LABELS = {
  defense: "Defense", healthcare: "Healthcare", finance: "Finance",
  government: "Government", education: "Education",
  "critical-infrastructure": "Critical Infrastructure", technology: "Technology",
  energy: "Energy", retail: "Retail", manufacturing: "Manufacturing",
  "private-sector": "Private Sector", other: "Other"
};

const AUDIENCE_LABELS = {
  employer: "Employer", "career-seeker": "Career Seeker",
  educator: "Educator", "general-inquirer": "General Inquirer"
};

function formatMonth(dateStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
}

function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function LeadAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const all = await base44.entities.Lead.list("-created_date", 500);
        setLeads(all);
      } catch {
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Target className="w-12 h-12 text-slate-600 mb-4" />
        <p className="text-slate-400">No leads yet to display analytics.</p>
      </div>
    );
  }

  // Build time-series: last 12 months
  const now = new Date();
  const monthBuckets = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthBuckets.push({ key, label: formatMonth(d), total: 0 });
  }
  const bucketMap = new Map(monthBuckets.map(b => [b.key, b]));

  // Aggregate by month + industry
  leads.forEach(lead => {
    if (!lead.created_date) return;
    const key = monthKey(lead.created_date);
    const bucket = bucketMap.get(key);
    if (!bucket) return;
    bucket.total++;
  });

  // Top industries by volume
  const industryCounts = {};
  leads.forEach(lead => {
    const ind = lead.industry || "other";
    industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  });
  const industryData = Object.entries(industryCounts)
    .map(([key, value]) => ({ name: INDUSTRY_LABELS[key] || key, value }))
    .sort((a, b) => b.value - a.value);

  // Audience breakdown
  const audienceCounts = {};
  leads.forEach(lead => {
    const aud = lead.audience_type || "general-inquirer";
    audienceCounts[aud] = (audienceCounts[aud] || 0) + 1;
  });
  const audienceData = Object.entries(audienceCounts)
    .map(([key, value]) => ({ name: AUDIENCE_LABELS[key] || key, value }))
    .sort((a, b) => b.value - a.value);

  // Industry over time (stacked area) — top 6 industries
  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k);

  const timeSeriesByIndustry = monthBuckets.map(bucket => {
    const row = { label: bucket.label };
    topIndustries.forEach(ind => { row[ind] = 0; });
    return row;
  });
  const tsMap = new Map(timeSeriesByIndustry.map((r, i) => [monthBuckets[i].key, r]));
  leads.forEach(lead => {
    if (!lead.created_date) return;
    const key = monthKey(lead.created_date);
    const row = tsMap.get(key);
    if (!row) return;
    const ind = lead.industry || "other";
    if (row[ind] !== undefined) row[ind]++;
  });

  const totalLeads = leads.length;
  const thisMonth = monthBuckets[monthBuckets.length - 1].total;
  const lastMonth = monthBuckets[monthBuckets.length - 2]?.total || 0;
  const momChange = lastMonth === 0 ? 100 : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

  const summaryCards = [
    { label: "Total Leads", value: totalLeads, icon: Target, color: "text-cyan-400" },
    { label: "This Month", value: thisMonth, icon: TrendingUp, color: "text-emerald-400" },
    { label: "MoM Change", value: `${momChange >= 0 ? "+" : ""}${momChange}%`, icon: TrendingUp, color: momChange >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Top Industry", value: industryData[0]?.name || "—", icon: Building2, color: "text-violet-400" },
  ];

  const tooltipStyle = {
    backgroundColor: "#0e111a",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "12px",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Lead Analytics Dashboard</h2>
          <p className="text-slate-400 text-sm">Lead volume by industry and audience pillar over time</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
              <Icon className={`w-7 h-7 flex-shrink-0 ${s.color}`} />
              <div className="min-w-0">
                <div className="text-lg font-bold text-white truncate">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Volume Over Time */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Lead Volume Over Time</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthBuckets}>
            <defs>
              <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#00f2ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="total" name="Total Leads" stroke="#00f2ff" strokeWidth={2} fill="url(#leadGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Industry Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Leads by Industry</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={110} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,242,255,0.05)" }} />
              <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
                {industryData.map((_, i) => (
                  <Cell key={i} fill={INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Breakdown */}
        <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Leads by Audience Pillar</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={audienceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={55}
                paddingAngle={3}
              >
                {audienceData.map((_, i) => (
                  <Cell key={i} fill={AUDIENCE_COLORS[i % AUDIENCE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Industry Over Time (Stacked) */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Top Industries Over Time</h3>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={timeSeriesByIndustry}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} iconType="circle" />
            {topIndustries.map((ind, i) => (
              <Area
                key={ind}
                type="monotone"
                dataKey={ind}
                name={INDUSTRY_LABELS[ind] || ind}
                stackId="1"
                stroke={INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]}
                fill={INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]}
                fillOpacity={0.6}
                strokeWidth={1.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}