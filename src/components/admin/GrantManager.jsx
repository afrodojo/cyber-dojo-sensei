import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Trash2, Pencil, X, Save, Loader2, DollarSign, Calendar, ExternalLink,
  CheckCircle2, XCircle, Eye, EyeOff, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function GrantManager() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadGrants = async () => {
    try {
      const data = await base44.entities.PhDGrant.list("-created_date", 100);
      setGrants(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadGrants(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this grant entry?")) return;
    try {
      await base44.entities.PhDGrant.delete(id);
      setGrants(prev => prev.filter(g => g.id !== id));
    } catch (e) { alert("Failed: " + e.message); }
  };

  const toggleActive = async (grant) => {
    try {
      await base44.entities.PhDGrant.update(grant.id, { is_active: !grant.is_active });
      setGrants(prev => prev.map(g => g.id === grant.id ? { ...g, is_active: !g.is_active } : g));
    } catch (e) { alert("Failed: " + e.message); }
  };

  const filtered = grants.filter(g => {
    if (filter === "active") return g.is_active;
    if (filter === "hidden") return !g.is_active;
    if (filter === "ai") return g.source === "ai_agent";
    return true;
  });

  if (loading) return (
    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Funding Feed Management</h2>
          <p className="text-slate-400 text-sm">Review, approve, edit, or delete automated PhD grants.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Award className="w-4 h-4 mr-1" /> Add Grant
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: `All (${grants.length})` },
          { key: "active", label: `Active (${grants.filter(g => g.is_active).length})` },
          { key: "hidden", label: `Hidden (${grants.filter(g => !g.is_active).length})` },
          { key: "ai", label: `AI-Discovered (${grants.filter(g => g.source === "ai_agent").length})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              filter === f.key
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((grant, i) => (
          <motion.div
            key={grant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm truncate">{grant.title}</span>
                  {grant.source === "ai_agent" && <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">AI</Badge>}
                  {!grant.is_active && <Badge variant="destructive" className="text-xs">Hidden</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{grant.provider}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{grant.amount?.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(grant)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all" title={grant.is_active ? "Hide" : "Approve/Show"}>
                  {grant.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditing(grant); setShowForm(true); }} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <a href={grant.application_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all" title="Open URL">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => handleDelete(grant.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No grants found in this filter.</p>
          </div>
        )}
      </div>

      {showForm && (
        <GrantForm
          grant={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadGrants(); }}
        />
      )}
    </div>
  );
}

function GrantForm({ grant, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: grant?.title || "",
    provider: grant?.provider || "",
    amount: grant?.amount || 0,
    deadline: grant?.deadline || "",
    description: grant?.description || "",
    application_url: grant?.application_url || "",
    category: grant?.category || "cybersecurity",
    is_active: grant?.is_active ?? true,
    source: grant?.source || "manual",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (grant?.id) {
        await base44.entities.PhDGrant.update(grant.id, payload);
      } else {
        await base44.entities.PhDGrant.create(payload);
      }
      onSaved();
    } catch (e) {
      alert("Failed: " + e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shuriken-clip"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{grant ? "Edit Grant" : "Add Grant"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Grant Title</label>
            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Provider</label>
              <Input value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Amount ($)</label>
              <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Deadline</label>
              <Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm">
                <option value="cybersecurity">Cybersecurity</option>
                <option value="defense">Defense</option>
                <option value="research">Research</option>
                <option value="entrepreneurship">Entrepreneurship</option>
                <option value="stem">STEM</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Application URL</label>
            <Input value={form.application_url} onChange={e => setForm({...form, application_url: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 accent-cyan-500" />
            Active (visible on Scrolls of Opportunity)
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 flex-1">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.title} className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            {saving ? "Saving…" : "Save Grant"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}