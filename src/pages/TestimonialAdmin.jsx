import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  MessageSquare, Plus, Edit, Trash2, Star, Search, AlertTriangle,
  Loader2, X, Save, ArrowLeft, Check, CheckCircle2, Clock, Mail
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ClientLogosSection from "@/components/testimonials/ClientLogosSection";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const emptyTestimonial = {
  name: "",
  title: "",
  company: "",
  relationship: "",
  text: "",
  rating: 5,
  user_type: "client-employer",
  email: "",
  is_approved: true,
};

const USER_TYPE_LABELS = {
  "client-employer": "Client / Employer",
  "career-seeker": "Career Seeker / Peer",
  "educational-institution": "Educational Institution",
};

// ── Editor View ────────────────────────────────────────────────────────────────
function TestimonialEditor({ testimonial, onSave, onCancel }) {
  const [editing, setEditing] = useState({ ...testimonial });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field, val) => setEditing(e => ({ ...e, [field]: val }));

  const handleSave = async () => {
    setSaving(true);
    if (editing.id) {
      await base44.entities.Testimonial.update(editing.id, editing);
    } else {
      await base44.entities.Testimonial.create(editing);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => { onSave(); }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400 hover:text-white gap-2 pl-0">
            <ArrowLeft className="w-4 h-4" /> All Testimonials
          </Button>

          <div className="flex-1 min-w-0">
            <input
              value={editing.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Client name..."
              className="w-full bg-transparent text-xl font-bold text-white placeholder:text-slate-600 outline-none border-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {saved && <span className="text-green-400 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span>}
            <Button variant="outline" size="sm" onClick={onCancel}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs gap-1.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Testimonial
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6 gap-6">
        {/* Main Editor */}
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Full Name *</label>
            <Input value={editing.name} onChange={e => set("name", e.target.value)}
              placeholder="Client name" className="bg-slate-900/60 border-slate-700 text-white" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-medium">Job Title *</label>
              <Input value={editing.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g., Chief Security Officer" className="bg-slate-900/60 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-medium">Company</label>
              <Input value={editing.company} onChange={e => set("company", e.target.value)}
                placeholder="Organization name" className="bg-slate-900/60 border-slate-700 text-white" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-medium">Relationship</label>
              <Input value={editing.relationship || ""} onChange={e => set("relationship", e.target.value)}
                placeholder="e.g., Colleague, Client, Manager" className="bg-slate-900/60 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-medium">User Type</label>
              <select
                value={editing.user_type || "client-employer"}
                onChange={e => set("user_type", e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="client-employer">Client / Employer</option>
                <option value="career-seeker">Career Seeker / Peer</option>
                <option value="educational-institution">Educational Institution</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Email</label>
            <Input value={editing.email || ""} onChange={e => set("email", e.target.value)}
              placeholder="reviewer@email.com" className="bg-slate-900/60 border-slate-700 text-white" />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Testimonial Text *</label>
            <Textarea value={editing.text} onChange={e => set("text", e.target.value)}
              placeholder="What would they say about working with you?" rows={8}
              className="bg-slate-900/60 border-slate-700 text-white resize-none" />
            <p className="text-xs text-slate-600 mt-1">{editing.text.length}/500 characters</p>
          </div>

          <label className="flex items-center gap-3 bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={!!editing.is_approved}
              onChange={e => set("is_approved", e.target.checked)}
              className="w-4 h-4 accent-cyan-500"
            />
            <span className="text-sm text-white font-medium">
              {editing.is_approved ? "Approved (visible publicly)" : "Pending review (hidden)"}
            </span>
          </label>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Rating *</label>
            <div className="flex items-center gap-3">
              <select value={editing.rating} onChange={e => set("rating", parseInt(e.target.value))}
                className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500">
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < editing.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 sticky top-24">
            <h3 className="text-sm font-semibold text-white mb-3">Preview</h3>
            <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{editing.name || "Name"}</div>
                  <div className="text-xs text-slate-400">{editing.title || "Title"}</div>
                </div>
              </div>
              {editing.company && <p className="text-xs text-slate-500">at <span className="text-slate-300 font-medium">{editing.company}</span></p>}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < editing.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />
                ))}
              </div>
              <p className="text-sm text-slate-300 italic">"{editing.text || "Testimonial will appear here..."}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── List View ──────────────────────────────────────────────────────────────────
export default function TestimonialAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const { isAdmin, loading } = useAdminAccess();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const all = await base44.entities.Testimonial.list("-created_date");
        setTestimonials(all);
      } catch {}
    };
    init();
  }, [isAdmin]);

  const reload = async () => {
    const all = await base44.entities.Testimonial.list("-created_date");
    setTestimonials(all);
    setEditing(null);
  };

  const deleteTestimonial = async (id) => {
    if (!confirm("Delete this testimonial permanently?")) return;
    await base44.entities.Testimonial.delete(id);
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const toggleApprove = async (testimonial) => {
    const next = !testimonial.is_approved;
    await base44.entities.Testimonial.update(testimonial.id, { is_approved: next });
    setTestimonials(testimonials.map(t => t.id === testimonial.id ? { ...t, is_approved: next } : t));
  };

  const filtered = testimonials.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.company?.toLowerCase().includes(search.toLowerCase()) ||
    t.text?.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="text-center p-8 bg-slate-900 rounded-lg border border-red-500/30">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400">Admin access required.</p>
      </div>
    </div>
  );

  if (editing !== null) {
    return <TestimonialEditor testimonial={editing} onSave={reload} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-cyan-400" /> Testimonial Manager
            </h1>
            <p className="text-slate-400 mt-1">Manage client testimonials and reviews</p>
          </div>
          <Button onClick={() => setEditing({ ...emptyTestimonial })}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> New Testimonial
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Testimonials", value: testimonials.length, icon: MessageSquare, color: "text-cyan-400" },
            { label: "Average Rating", value: `${avgRating} / 5`, icon: Star, color: "text-yellow-400" },
            { label: "Pending Approval", value: testimonials.filter(t => t.is_approved === false).length, icon: Clock, color: "text-amber-400" },
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

        {/* Client Logos Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mb-10 bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
          <ClientLogosSection />
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-slate-600 text-xs font-medium uppercase tracking-wider">Testimonials</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, company, or content..." className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
          </div>
        </div>

        {/* Testimonial List */}
        <div className="space-y-3">
          {filtered.map((testimonial, i) => (
            <motion.div key={testimonial.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div>
                          <h3 className="text-white font-bold">{testimonial.name}</h3>
                          <p className="text-slate-400 text-sm">{testimonial.title}</p>
                        </div>
                        {testimonial.is_approved === false ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        )}
                      </div>
                      {testimonial.email && (
                        <p className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {testimonial.email}
                        </p>
                      )}
                      {testimonial.company && (
                        <p className="text-slate-500 text-xs mb-2">at <span className="text-slate-300">{testimonial.company}</span></p>
                      )}
                      {testimonial.user_type && (
                        <p className="text-slate-500 text-xs mb-2">Type: <span className="text-slate-300">{USER_TYPE_LABELS[testimonial.user_type] || testimonial.user_type}</span></p>
                      )}
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (testimonial.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-slate-700"}`} />
                        ))}
                      </div>
                      <p className="text-slate-300 text-sm italic">"{testimonial.text}"</p>
                      {testimonial.relationship && <p className="text-slate-600 text-xs mt-2">Relationship: {testimonial.relationship}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button size="sm" variant="ghost"
                        onClick={() => toggleApprove(testimonial)}
                        title={testimonial.is_approved === false ? "Approve" : "Unapprove"}
                        className={testimonial.is_approved === false
                          ? "text-amber-400 hover:text-green-400 gap-1.5 text-xs"
                          : "text-green-400 hover:text-amber-400 gap-1.5 text-xs"}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {testimonial.is_approved === false ? "Approve" : "Unapprove"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing({ ...testimonial })}
                        className="text-slate-400 hover:text-cyan-400 gap-1.5 text-xs">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-slate-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">{search ? "No testimonials found" : "No testimonials yet"}</p>
              <p className="text-sm mt-1">{search ? "Try adjusting your search" : "Click 'New Testimonial' to get started"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}