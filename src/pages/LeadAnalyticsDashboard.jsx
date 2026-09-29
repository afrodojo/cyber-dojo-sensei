import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Mail, Target, Download } from "lucide-react";
import SEOHead from "../components/seo/SEOHead";

const COLORS = ["#06b6d4", "#0ea5e9", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899"];

export default function LeadAnalyticsDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === "admin") {
          setIsAdmin(true);
          const leadData = await base44.entities.Lead.list();
          setLeads(leadData);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdminAndLoadData();
  }, []);

  const filterLeadsByDate = (leadsToFilter) => {
    if (dateRange === "all") return leadsToFilter;
    
    const now = new Date();
    const filtered = leadsToFilter.filter(lead => {
      const leadDate = new Date(lead.created_date);
      const diffDays = Math.floor((now - leadDate) / (1000 * 60 * 60 * 24));
      
      if (dateRange === "7days") return diffDays <= 7;
      if (dateRange === "30days") return diffDays <= 30;
      if (dateRange === "90days") return diffDays <= 90;
      return true;
    });
    return filtered;
  };

  const filteredLeads = filterLeadsByDate(leads);

  // Calculate metrics
  const totalSubmissions = filteredLeads.length;
  const qualified = filteredLeads.filter(l => ["qualified", "proposal-sent", "closed-won"].includes(l.status)).length;
  const qualificationRate = totalSubmissions > 0 ? ((qualified / totalSubmissions) * 100).toFixed(1) : 0;

  // Service interest breakdown
  const serviceBreakdown = Object.entries(
    filteredLeads.reduce((acc, lead) => {
      const service = lead.service_interest || "other";
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {})
  ).map(([service, count]) => ({
    name: service.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    value: count,
    service: service
  }));

  // Status breakdown
  const statusBreakdown = Object.entries(
    filteredLeads.reduce((acc, lead) => {
      const status = lead.status || "new";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    value: count,
    status: status
  }));

  // Daily submissions (last 30 days)
  const dailyData = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyData[dateStr] = 0;
  }

  filteredLeads.forEach(lead => {
    const leadDate = new Date(lead.created_date);
    const dateStr = leadDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dateStr in dailyData) dailyData[dateStr]++;
  });

  const dailySubmissions = Object.entries(dailyData).map(([date, count]) => ({
    date,
    submissions: count
  }));

  // Budget distribution
  const budgetBreakdown = Object.entries(
    filteredLeads.reduce((acc, lead) => {
      const budget = lead.budget_range || "unknown";
      acc[budget] = (acc[budget] || 0) + 1;
      return acc;
    }, {})
  ).map(([budget, count]) => ({
    name: budget.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    value: count
  })).filter(item => item.name !== "Unknown");

  const exportCSV = () => {
    const headers = ["Name", "Email", "Company", "Service Interest", "Status", "Created Date"];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.company || "N/A",
      lead.service_interest || "N/A",
      lead.status,
      new Date(lead.created_date).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">You need admin access to view this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <SEOHead title="Lead Analytics Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Lead Analytics</h1>
            <p className="text-slate-400">Track form submissions and lead generation metrics</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <Button
              onClick={exportCSV}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Submissions", value: totalSubmissions, color: "from-cyan-500 to-blue-500" },
            { icon: Target, label: "Qualified Leads", value: qualified, color: "from-green-500 to-emerald-500" },
            { icon: TrendingUp, label: "Qualification Rate", value: `${qualificationRate}%`, color: "from-purple-500 to-pink-500" },
            { icon: Mail, label: "Conversion Rate", value: `${totalSubmissions > 0 ? ((filteredLeads.filter(l => l.status === "closed-won").length / totalSubmissions) * 100).toFixed(1) : 0}%`, color: "from-yellow-500 to-orange-500" }
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                      <p className="text-3xl font-bold text-white">{metric.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Daily Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySubmissions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="submissions" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Interest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Service Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lead Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Budget Range Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Service</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.slice(0, 10).map((lead) => (
                      <tr key={lead.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 text-slate-300">{lead.name}</td>
                        <td className="py-3 px-4 text-slate-400 text-xs">{lead.email}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-slate-700/50 text-slate-300 text-xs">
                            {lead.service_interest?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Other"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`text-xs ${
                            lead.status === "closed-won" ? "bg-green-500/20 text-green-300" :
                            lead.status === "qualified" ? "bg-blue-500/20 text-blue-300" :
                            lead.status === "new" ? "bg-yellow-500/20 text-yellow-300" :
                            "bg-slate-500/20 text-slate-300"
                          }`}>
                            {lead.status?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">{new Date(lead.created_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}