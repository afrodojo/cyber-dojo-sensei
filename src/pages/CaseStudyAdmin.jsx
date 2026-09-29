import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  ShieldAlert, Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff,
  Search, AlertTriangle, Loader2, X, ArrowLeft, CheckCircle,
  Bug, TrendingDown, DollarSign, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const CATEGORIES = ["red-team", "penetration-testing", "compliance", "incident-response", "security-architecture", "physical-security"];
const INDUSTRIES = ["defense", "healthcare", "finance", "government", "education", "critical-infrastructure", "private-sector", "other"];

const SEVERITY_COLORS = {
  critical: "bg-red-500/20 text-red-300 border-red-500/40",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  low: "bg-blue-500/20 text-blue-300 border-blue-500/40",
};

const empty = {
  title: "", client: "", industry: "private-sector", category: "penetration-testing",
  challenge: "", solution: "", results: [], duration: "",
  vulnerabilities_found: 0, critical_vulns: 0, high_vulns: 0, medium_vulns: 0, low_vulns: 0,
  vuln_highlights: [], attack_vectors: [], risk_reduction: "", risk_reduction_number: 0,
  potential_savings: "", tools_used: [], testimonial: "", image_url: "",
  featured: false, published: false
};

function ListInput({ label, value = [], onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) { onChange([...value, v]); setInput(""); }
  };
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <div className="flex gap-2 mb-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder} className="bg-slate-800 border-slate-600 text-white text-sm h-8 flex-1" />
        <Button size="sm" onClick={add} variant="outline" className="border-slate-600 text-slate-300 h-8 px-3">Add</Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span key={i} className="flex items-center gap-1 bg-slate-700/60 text-slate-300 text-xs rounded-md px-2 py-1 border border-slate-600">
            {v}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 ml-1">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function CaseStudyForm({ study, onSave, onCancel }) {
  const [data, setData] = useState({ ...empty, ...study });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field, val) => setData(d => ({ ...d, [field]: val }));

  const handleSave = async () => {
    setSaving(true);
    if (data.id) {
      await base44.entities.CaseStudy.update(data.id, data);
    } else {
      await base44.entities.CaseStudy.create(data);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(onSave, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400 hover:text-white gap-2 pl-0">
            <ArrowLeft className="w-4 h-4" /> All Case Studies
          </Button>
          <input
            value={data.title}
            onChange={e => set("title", e.target.value)}
            placeholder="Case study title..."
            className="flex-1 bg-transparent text-xl font-bold text-white placeholder:text-slate-600 outline-none border-none min-w-0"
          />
          <div className="flex gap-2">
            {saved && <span className="text-green-400 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved</span>}
            <Button variant="outline" size="sm" onClick={() => { set("published", false); handleSave(); }}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs">Save Draft</Button>
            <Button size="sm" onClick={() => { set("published", true); handleSave(); }} disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs gap-1.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-5">

          {/* Client & Context */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Client & Engagement</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Client Name (can be anonymized)</label>
                <Input value={data.client} onChange={e => set("client", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="e.g. Fortune 500 Firm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Duration</label>
                <Input value={data.duration} onChange={e => set("duration", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="e.g. 3 weeks" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Challenge</label>
              <Textarea value={data.challenge} onChange={e => set("challenge", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm" rows={3}
                placeholder="Describe the security problem or challenge..." />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Solution</label>
              <Textarea value={data.solution} onChange={e => set("solution", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm" rows={3}
                placeholder="How did you address it?" />
            </div>
            <ListInput label="Key Results" value={data.results} onChange={v => set("results", v)}
              placeholder="e.g. Remediated all critical findings within 30 days" />
          </div>

          {/* Vulnerability Details */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bug className="w-4 h-4 text-red-400" /> Vulnerability Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { field: "critical_vulns", label: "Critical", color: "text-red-400" },
                { field: "high_vulns", label: "High", color: "text-orange-400" },
                { field: "medium_vulns", label: "Medium", color: "text-yellow-400" },
                { field: "low_vulns", label: "Low", color: "text-blue-400" },
              ].map(({ field, label, color }) => (
                <div key={field}>
                  <label className={`text-xs mb-1 block font-medium ${color}`}>{label}</label>
                  <Input type="number" min={0} value={data[field] || 0}
                    onChange={e => set(field, parseInt(e.target.value) || 0)}
                    className="bg-slate-800 border-slate-600 text-white text-sm h-8" />
                </div>
              ))}
            </div>
            <ListInput label="Vulnerability Highlights (specific findings)"
              value={data.vuln_highlights} onChange={v => set("vuln_highlights", v)}
              placeholder="e.g. Unauthenticated RCE via misconfigured Jenkins" />
            <ListInput label="Attack Vectors"
              value={data.attack_vectors} onChange={v => set("attack_vectors", v)}
              placeholder="e.g. Spear Phishing, SQL Injection" />
          </div>

          {/* Outcomes */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" /> Risk Reduction & Outcomes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Risk Reduction % (display)</label>
                <Input value={data.risk_reduction} onChange={e => set("risk_reduction", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="e.g. 87%" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Risk Reduction % (number, for sorting)</label>
                <Input type="number" min={0} max={100} value={data.risk_reduction_number || ""}
                  onChange={e => set("risk_reduction_number", parseInt(e.target.value) || 0)}
                  className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="e.g. 87" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Potential Savings / Value</label>
              <Input value={data.potential_savings} onChange={e => set("potential_savings", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="e.g. $2.4M breach cost avoided" />
            </div>
            <ListInput label="Tools & Frameworks Used"
              value={data.tools_used} onChange={v => set("tools_used", v)}
              placeholder="e.g. Metasploit, Burp Suite, MITRE ATT&CK" />
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Client Testimonial (optional)</label>
              <Textarea value={data.testimonial} onChange={e => set("testimonial", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm" rows={2}
                placeholder="Quote from the client..." />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Settings</h3>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <Select value={data.category} onValueChange={v => set("category", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Industry</label>
              <Select value={data.industry} onValueChange={v => set("industry", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cover Image URL</label>
              <Input value={data.image_url || ""} onChange={e => set("image_url", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="https://..." />
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Featured</span>
              <div onClick={() => set("featured", !data.featured)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${data.featured ? "bg-yellow-500" : "bg-slate-600"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Published</span>
              <div onClick={() => set("published", !data.published)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${data.published ? "bg-green-500" : "bg-slate-600"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.published ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
          </div>

          {/* Vuln Summary Preview */}
          {(data.critical_vulns + data.high_vulns + data.medium_vulns + data.low_vulns) > 0 && (
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Vuln Preview</h3>
              <div className="space-y-1.5">
                {[
                  { label: "Critical", count: data.critical_vulns, cls: SEVERITY_COLORS.critical },
                  { label: "High", count: data.high_vulns, cls: SEVERITY_COLORS.high },
                  { label: "Medium", count: data.medium_vulns, cls: SEVERITY_COLORS.medium },
                  { label: "Low", count: data.low_vulns, cls: SEVERITY_COLORS.low },
                ].filter(s => s.count > 0).map(s => (
                  <div key={s.label} className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium ${s.cls}`}>
                    <span>{s.label}</span><span>{s.count}</span>
                  </div>
                ))}
              </div>
              {data.risk_reduction_number > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Risk Reduction</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(data.risk_reduction_number, 100)}%` }} />
                  </div>
                  <div className="text-right text-xs text-green-400 mt-1">{data.risk_reduction_number}%</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyAdmin() {
  const [studies, setStudies] = useState([]);
  const { isAdmin, loading } = useAdminAccess();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const all = await base44.entities.CaseStudy.list("-created_date");
        setStudies(all);
      } catch {}
    };
    init();
  }, [isAdmin]);

  const reload = async () => {
    const all = await base44.entities.CaseStudy.list("-created_date");
    setStudies(all);
    setEditing(null);
  };

  const deleteStudy = async (id) => {
    if (!confirm("Delete this case study?")) return;
    await base44.entities.CaseStudy.delete(id);
    setStudies(studies.filter(s => s.id !== id));
  };

  const toggle = async (study, field) => {
    await base44.entities.CaseStudy.update(study.id, { [field]: !study[field] });
    setStudies(studies.map(s => s.id === study.id ? { ...s, [field]: !s[field] } : s));
  };

  const filtered = studies.filter(s => {
    const matchSearch = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.client?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || s.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalVulns = studies.reduce((acc, s) => acc + (s.vulnerabilities_found || s.critical_vulns + s.high_vulns + s.medium_vulns + s.low_vulns || 0), 0);
  const avgRisk = studies.filter(s => s.risk_reduction_number > 0);
  const avgRiskReduction = avgRisk.length ? Math.round(avgRisk.reduce((a, s) => a + s.risk_reduction_number, 0) / avgRisk.length) : 0;

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-slate-950"><Loader2 className="w-10 h-10 text-cyan-400 animate-spin" /></div>;

  if (!isAdmin) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
      <AlertTriangle className="w-14 h-14 text-red-400 mb-4" />
      <p className="text-slate-400">Admin access required.</p>
    </div>
  );

  if (editing !== null) return <CaseStudyForm study={editing} onSave={reload} onCancel={() => setEditing(null)} />;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-400" /> Case Study Manager
            </h1>
            <p className="text-slate-400 mt-1">Document vulnerabilities found and risk reduction results</p>
          </div>
          <Button onClick={() => setEditing({ ...empty })}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> New Case Study
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Case Studies", value: studies.length, icon: ShieldAlert, color: "text-cyan-400" },
            { label: "Published", value: studies.filter(s => s.published).length, icon: Eye, color: "text-green-400" },
            { label: "Vulns Documented", value: totalVulns, icon: Bug, color: "text-red-400" },
            { label: "Avg Risk Reduction", value: avgRiskReduction ? `${avgRiskReduction}%` : "—", icon: TrendingDown, color: "text-emerald-400" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <Icon className={`w-6 h-6 ${s.color}`} />
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or client..." className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-44 bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((study, i) => {
              const totalV = study.critical_vulns + study.high_vulns + study.medium_vulns + study.low_vulns || study.vulnerabilities_found || 0;
              return (
                <motion.div key={study.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs capitalize">{study.category?.replace(/-/g, " ")}</Badge>
                            {study.industry && <Badge className="bg-slate-700/30 text-slate-400 border-slate-700 text-xs capitalize">{study.industry}</Badge>}
                            {study.featured && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs border">⭐ Featured</Badge>}
                            {study.published
                              ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs border">Published</Badge>
                              : <Badge className="bg-slate-600/40 text-slate-400 border-slate-600 text-xs border">Draft</Badge>}
                          </div>
                          <h3 className="text-white font-bold text-lg leading-tight">{study.title || <span className="italic text-slate-600">Untitled</span>}</h3>
                          <p className="text-slate-500 text-sm mt-0.5">{study.client}{study.duration ? ` · ${study.duration}` : ""}</p>

                          {/* Vuln + Risk badges */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {study.critical_vulns > 0 && <span className={`text-xs px-2 py-0.5 rounded border font-medium ${SEVERITY_COLORS.critical}`}>{study.critical_vulns} Critical</span>}
                            {study.high_vulns > 0 && <span className={`text-xs px-2 py-0.5 rounded border font-medium ${SEVERITY_COLORS.high}`}>{study.high_vulns} High</span>}
                            {study.medium_vulns > 0 && <span className={`text-xs px-2 py-0.5 rounded border font-medium ${SEVERITY_COLORS.medium}`}>{study.medium_vulns} Medium</span>}
                            {study.low_vulns > 0 && <span className={`text-xs px-2 py-0.5 rounded border font-medium ${SEVERITY_COLORS.low}`}>{study.low_vulns} Low</span>}
                            {study.risk_reduction && (
                              <span className="text-xs px-2 py-0.5 rounded border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium">
                                ↓ {study.risk_reduction} Risk Reduction
                              </span>
                            )}
                            {study.potential_savings && (
                              <span className="text-xs px-2 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium">
                                {study.potential_savings}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => setEditing({ ...study })}
                            className="text-slate-400 hover:text-cyan-400 gap-1.5 text-xs">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => toggle(study, "published")}
                            className="text-slate-400 hover:text-white" title={study.published ? "Unpublish" : "Publish"}>
                            {study.published ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => toggle(study, "featured")}
                            className="text-slate-400 hover:text-yellow-400">
                            {study.featured ? <Star className="w-4 h-4 text-yellow-400" /> : <StarOff className="w-4 h-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteStudy(study.id)}
                            className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No case studies found</p>
              <p className="text-sm mt-1">Click "New Case Study" to document your first engagement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}