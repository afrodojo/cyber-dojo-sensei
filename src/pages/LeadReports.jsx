import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  FileText, Download, RefreshCw, Plus, ChevronRight,
  BarChart2, TrendingUp, Bot, Calendar, Loader2, CheckCircle, X
} from "lucide-react";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const TEMPLATES = [
  {
    id: "executive_summary",
    name: "Executive Summary",
    description: "High-level KPIs and top 3 actionable insights",
    icon: "📋"
  },
  {
    id: "detailed_analysis",
    name: "Detailed Analysis",
    description: "Full breakdown with scoring, engagement, and recommendations",
    icon: "📊"
  },
  {
    id: "trend_report",
    name: "Trend Report",
    description: "Trajectory analysis and forecasts over time",
    icon: "📈"
  }
];

export default function LeadReports() {
  const { isAdmin, loading } = useAdminAccess();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newReportConfig, setNewReportConfig] = useState({ period: "weekly", template: "executive_summary" });

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const data = await base44.entities.LeadReport.list("-created_date", 20);
        setReports(data);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [isAdmin]);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const title = `${newReportConfig.period === "weekly" ? "Weekly" : "Monthly"} ${
        TEMPLATES.find(t => t.id === newReportConfig.template)?.name
      } — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

      const record = await base44.entities.LeadReport.create({
        title,
        period: newReportConfig.period,
        template: newReportConfig.template,
        status: "generating"
      });

      const response = await base44.functions.invoke("generateLeadReport", {
        period: newReportConfig.period,
        template: newReportConfig.template,
        report_id: record.id
      });

      const updatedRecord = {
        ...record,
        ...response.data,
        title,
        status: "ready"
      };
      setReports(prev => [updatedRecord, ...prev]);
      setSelectedReport(updatedRecord);
      setShowNewForm(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportMarkdown = (report) => {
    const blob = new Blob([report.report_content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = (report) => {
    const rows = [
      ["Report Title", report.title],
      ["Period", report.period],
      ["Template", report.template],
      ["Period Start", report.period_start || ""],
      ["Period End", report.period_end || ""],
      ["Total Leads", report.total_leads || ""],
      ["Average Score", report.avg_score || ""],
      ["Suggestions Total", report.suggestions_total || ""],
      ["Suggestions Accepted", report.suggestions_accepted || ""],
      ["Acceptance Rate", report.suggestions_total
        ? `${Math.round((report.suggestions_accepted / report.suggestions_total) * 100)}%` : "N/A"],
      ["Key Insights", (report.key_insights || []).join(" | ")]
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    await base44.entities.LeadReport.delete(id);
    setReports(prev => prev.filter(r => r.id !== id));
    if (selectedReport?.id === id) setSelectedReport(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
        <p className="text-slate-400">This page is only accessible to administrators.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-cyan-400" />
              AI Lead Reports
            </h1>
            <p className="text-slate-400 mt-1">Auto-generated insights on engagement, scoring, and suggestion effectiveness</p>
          </div>
          <Button
            onClick={() => setShowNewForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* New Report Form */}
        <AnimatePresence>
          {showNewForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-white mb-4">New Report Configuration</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Period Selection */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Report Period</label>
                  <div className="flex gap-3">
                    {["weekly", "monthly"].map(p => (
                      <button
                        key={p}
                        onClick={() => setNewReportConfig(c => ({ ...c, period: p }))}
                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                          newReportConfig.period === p
                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                            : "border-slate-600 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        <Calendar className="w-4 h-4 inline mr-1.5" />
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Template</label>
                  <div className="space-y-2">
                    {TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setNewReportConfig(c => ({ ...c, template: t.id }))}
                        className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all ${
                          newReportConfig.template === t.id
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        <span className="mr-2">{t.icon}</span>
                        <span className="font-medium text-white">{t.name}</span>
                        <span className="text-slate-400 ml-2 text-xs">{t.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" />Generate with AI</>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)} className="border-slate-600">Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Report List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Report History</h2>
            {reports.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No reports yet. Generate your first one!</p>
              </div>
            )}
            {reports.map(report => (
              <motion.button
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedReport?.id === report.id
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{report.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${
                        report.period === "weekly" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                      } border-0`}>
                        {report.period}
                      </Badge>
                      <Badge className="text-xs bg-slate-700 text-slate-400 border-0 capitalize">
                        {report.template?.replace("_", " ")}
                      </Badge>
                    </div>
                    {report.status === "ready" && report.avg_score !== undefined && (
                      <p className="text-xs text-slate-500 mt-1">
                        {report.total_leads} leads · Avg score {report.avg_score}
                      </p>
                    )}
                  </div>
                  {report.status === "generating" ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Report Detail */}
          <div className="lg:col-span-2">
            {!selectedReport ? (
              <div className="flex flex-col items-center justify-center h-96 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                <BarChart2 className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Select a report to view its details</p>
              </div>
            ) : (
              <motion.div
                key={selectedReport.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
              >
                {/* Report Header */}
                <div className="p-6 border-b border-slate-700 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                    {selectedReport.period_start && (
                      <p className="text-slate-400 text-sm mt-1">
                        {selectedReport.period_start} → {selectedReport.period_end}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportCSV(selectedReport)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-1" /> CSV
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportMarkdown(selectedReport)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-1" /> MD
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(selectedReport.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Metrics Row */}
                {selectedReport.status === "ready" && (
                  <div className="grid grid-cols-3 divide-x divide-slate-700 border-b border-slate-700">
                    {[
                      { label: "Total Leads", value: selectedReport.total_leads ?? "—", icon: TrendingUp, color: "text-cyan-400" },
                      { label: "Avg Score", value: selectedReport.avg_score !== undefined ? `${selectedReport.avg_score}/100` : "—", icon: BarChart2, color: "text-blue-400" },
                      {
                        label: "Suggestion Rate",
                        value: selectedReport.suggestions_total
                          ? `${Math.round((selectedReport.suggestions_accepted / selectedReport.suggestions_total) * 100)}%`
                          : "—",
                        icon: CheckCircle,
                        color: "text-green-400"
                      }
                    ].map((m, i) => (
                      <div key={i} className="p-4 text-center">
                        <m.icon className={`w-5 h-5 ${m.color} mx-auto mb-1`} />
                        <p className="text-xl font-bold text-white">{m.value}</p>
                        <p className="text-xs text-slate-400">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Insights */}
                {selectedReport.key_insights?.length > 0 && (
                  <div className="p-6 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Key Insights</h3>
                    <ul className="space-y-2">
                      {selectedReport.key_insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-cyan-400 font-bold flex-shrink-0">{i + 1}.</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Report Content */}
                <div className="p-6">
                  {selectedReport.status === "generating" ? (
                    <div className="flex items-center gap-3 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                      <span>AI is generating your report...</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-table:text-slate-300">
                      <ReactMarkdown>{selectedReport.report_content || "No content available."}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}