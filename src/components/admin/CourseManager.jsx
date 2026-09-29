import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Plus, Trash2, Pencil, X, Save, Loader2, DollarSign, Tag, Clock,
  FileText, Eye, EyeOff, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadCourses = async () => {
    try {
      const data = await base44.entities.Course.list("display_order");
      setCourses(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadCourses(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      await base44.entities.Course.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (e) { alert("Failed to delete: " + e.message); }
  };

  const toggleActive = async (course) => {
    try {
      await base44.entities.Course.update(course.id, { is_active: !course.is_active });
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_active: !c.is_active } : c));
    } catch (e) { alert("Failed: " + e.message); }
  };

  if (loading) return (
    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Course & Pricing Management</h2>
          <p className="text-slate-400 text-sm">Edit, add, or delete training packages from EDS Defense.</p>
        </div>
        <Button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Course
        </Button>
      </div>

      <div className="space-y-3">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-4 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm truncate">{course.title}</span>
                {!course.is_active && <Badge variant="destructive" className="text-xs">Hidden</Badge>}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{course.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-cyan-400 font-bold text-lg">
                {course.price_label || `$${course.price}`}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(course)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all" title={course.is_active ? "Hide" : "Show"}>
                {course.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => { setEditing(course); setShowForm(true); }} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all" title="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(course.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <CourseForm
            course={editing}
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); loadCourses(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseForm({ course, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: course?.title || "",
    description: course?.description || "",
    syllabus: course?.syllabus || "",
    duration: course?.duration || "5 hours",
    format: course?.format || "In-Person",
    price: course?.price || 0,
    price_label: course?.price_label || "",
    category: course?.category || "Firearms",
    image_url: course?.image_url || "",
    registration_url: course?.registration_url || "https://defense.eds-360.com/training-programs",
    is_active: course?.is_active ?? true,
    display_order: course?.display_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), display_order: Number(form.display_order) };
      if (course?.id) {
        await base44.entities.Course.update(course.id, payload);
      } else {
        await base44.entities.Course.create(payload);
      }
      onSaved();
    } catch (e) {
      alert("Failed to save: " + e.message);
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shuriken-clip"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{course ? "Edit Course" : "Add Course"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Course Title</label>
            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Price ($)</label>
              <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Price Label (optional)</label>
              <Input value={form.price_label} onChange={e => setForm({...form, price_label: e.target.value})} placeholder="$75/hour" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Duration</label>
              <Input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm">
                <option value="Firearms">Firearms</option>
                <option value="Certification">Certification</option>
                <option value="Training">Training</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Registration URL</label>
            <Input value={form.registration_url} onChange={e => setForm({...form, registration_url: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Display Order</label>
              <Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer pb-2">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 accent-cyan-500" />
                Active (visible publicly)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 flex-1">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.title} className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            {saving ? "Saving…" : "Save Course"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}