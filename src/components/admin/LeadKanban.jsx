import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Loader2, RefreshCw, Briefcase, GraduationCap, Building2, Users, Mail, Phone, Filter, X, CheckCircle2, Circle, Layers
} from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "red-team", label: "Red Team" },
  { value: "penetration-testing", label: "Penetration Testing" },
  { value: "security-consulting", label: "Security Consulting" },
  { value: "training", label: "Training" },
  { value: "speaking", label: "Speaking" },
  { value: "other", label: "Other" },
];

const INDUSTRY_OPTIONS = [
  { value: "defense", label: "Defense" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "government", label: "Government" },
  { value: "education", label: "Education" },
  { value: "critical-infrastructure", label: "Critical Infrastructure" },
  { value: "technology", label: "Technology" },
  { value: "energy", label: "Energy" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "private-sector", label: "Private Sector" },
  { value: "other", label: "Other" },
];

const BUDGET_OPTIONS = [
  { value: "under-25k", label: "Under $25K" },
  { value: "25k-50k", label: "$25K–$50K" },
  { value: "50k-100k", label: "$50K–$100K" },
  { value: "100k-250k", label: "$100K–$250K" },
  { value: "250k-plus", label: "$250K+" },
];

const TIMELINE_OPTIONS = [
  { value: "immediate", label: "Immediate" },
  { value: "1-3-months", label: "1–3 Months" },
  { value: "3-6-months", label: "3–6 Months" },
  { value: "6-12-months", label: "6–12 Months" },
  { value: "future", label: "Future" },
];

// Maps the Lead entity's audience_type to the four audience pillars
const PILLARS = [
  {
    key: "employer",
    label: "Business",
    icon: Briefcase,
    accent: "border-cyan-500/40",
    headerBg: "from-cyan-900/40 to-slate-900",
    chip: "bg-cyan-500/15 text-cyan-300",
    dot: "bg-cyan-400",
  },
  {
    key: "career-seeker",
    label: "Career",
    icon: GraduationCap,
    accent: "border-violet-500/40",
    headerBg: "from-violet-900/40 to-slate-900",
    chip: "bg-violet-500/15 text-violet-300",
    dot: "bg-violet-400",
  },
  {
    key: "educator",
    label: "Institutional",
    icon: Building2,
    accent: "border-emerald-500/40",
    headerBg: "from-emerald-900/40 to-slate-900",
    chip: "bg-emerald-500/15 text-emerald-300",
    dot: "bg-emerald-400",
  },
  {
    key: "general-inquirer",
    label: "General",
    icon: Users,
    accent: "border-amber-500/40",
    headerBg: "from-amber-900/40 to-slate-900",
    chip: "bg-amber-500/15 text-amber-300",
    dot: "bg-amber-400",
  },
];

const STATUS_LABELS = {
  new: { text: "New", cls: "bg-blue-500/15 text-blue-300" },
  contacted: { text: "Contacted", cls: "bg-yellow-500/15 text-yellow-300" },
  qualified: { text: "Qualified", cls: "bg-emerald-500/15 text-emerald-300" },
  "proposal-sent": { text: "Proposal", cls: "bg-purple-500/15 text-purple-300" },
  "closed-won": { text: "Won", cls: "bg-green-500/15 text-green-300" },
  "closed-lost": { text: "Lost", cls: "bg-red-500/15 text-red-300" },
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal-sent", label: "Proposal Sent" },
  { value: "closed-won", label: "Closed Won" },
  { value: "closed-lost", label: "Closed Lost" },
];

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer min-w-[140px]"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function LeadCard({ lead, pillar, isSelected, onToggleSelect }) {
  const status = STATUS_LABELS[lead.status] || STATUS_LABELS.new;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`bg-slate-900/80 border rounded-lg p-3 transition-colors ${
        isSelected ? "border-cyan-500 ring-1 ring-cyan-500/30" : "border-slate-700/60 hover:border-slate-500"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 min-w-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSelect(lead.id); }}
            className="mt-0.5 flex-shrink-0"
            aria-label={isSelected ? "Deselect lead" : "Select lead"}
          >
            {isSelected ? (
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
            )}
          </button>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{lead.name || "Unnamed"}</p>
            {lead.company && (
              <p className="text-slate-400 text-xs truncate">{lead.company}</p>
            )}
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${status.cls}`}>
          {status.text}
        </span>
      </div>
      {lead.message && (
        <p className="text-slate-400 text-xs line-clamp-2 mb-2 leading-relaxed">
          {lead.message}
        </p>
      )}
      <div className="flex items-center gap-3 text-slate-500 text-xs">
        {lead.email && (
          <span className="flex items-center gap-1 truncate">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </span>
        )}
        {lead.phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function LeadKanban() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filters, setFilters] = useState({
    service_interest: "",
    industry: "",
    budget_range: "",
    timeline: "",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkPillar, setBulkPillar] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const clearFilters = () => setFilters({ service_interest: "", industry: "", budget_range: "", timeline: "" });
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = (ids) => {
    const allSelected = ids.length > 0 && ids.every(id => selectedIds.includes(id));
    setSelectedIds(prev => allSelected ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };
  const clearSelection = () => setSelectedIds([]);

  const applyBulk = async () => {
    if (!bulkPillar && !bulkStatus) return;
    setBulkBusy(true);
    const updates = selectedIds.map((id) => {
      const patch = {};
      if (bulkPillar) patch.audience_type = bulkPillar;
      if (bulkStatus) patch.status = bulkStatus;
      return { id, ...patch };
    });
    try {
      await base44.entities.Lead.bulkUpdate(updates);
      setLeads(prev => prev.map(l => {
        if (!selectedIds.includes(l.id)) return l;
        const patch = {};
        if (bulkPillar) patch.audience_type = bulkPillar;
        if (bulkStatus) patch.status = bulkStatus;
        return { ...l, ...patch };
      }));
      setBulkOpen(false);
      setBulkPillar("");
      setBulkStatus("");
      clearSelection();
    } catch {
    } finally {
      setBulkBusy(false);
    }
  };

  const fetchLeads = useCallback(async () => {
    try {
      setRefreshing(true);
      const all = await base44.entities.Lead.list("-created_date", 500);
      setLeads(all || []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Apply filters, then group into pillar columns
  const filteredLeads = leads.filter((l) =>
    (!filters.service_interest || l.service_interest === filters.service_interest) &&
    (!filters.industry || l.industry === filters.industry) &&
    (!filters.budget_range || l.budget_range === filters.budget_range) &&
    (!filters.timeline || l.timeline === filters.timeline)
  );

  const grouped = PILLARS.reduce((acc, p) => {
    acc[p.key] = filteredLeads.filter(l => (l.audience_type || "general-inquirer") === p.key);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const lead = leads.find(l => l.id === draggableId);
    if (!lead) return;

    // Optimistic update: move the card immediately
    setLeads(prev =>
      prev.map(l => l.id === lead.id ? { ...l, audience_type: destination.droppableId } : l)
    );

    setUpdatingId(draggableId);
    try {
      await base44.entities.Lead.update(lead.id, { audience_type: destination.droppableId });
    } catch {
      // Revert on failure
      setLeads(prev =>
        prev.map(l => l.id === lead.id ? { ...l, audience_type: source.droppableId } : l)
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Lead Pipeline — Audience Pillars</h2>
          <p className="text-slate-400 text-sm">
            Drag leads between columns to reassign their audience segment. {leads.length} total leads.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-end flex-wrap gap-3 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium pb-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">{activeFilterCount}</span>
          )}
        </div>
        <FilterSelect label="Service" value={filters.service_interest} onChange={(v) => setFilter("service_interest", v)} options={SERVICE_OPTIONS} />
        <FilterSelect label="Industry" value={filters.industry} onChange={(v) => setFilter("industry", v)} options={INDUSTRY_OPTIONS} />
        <FilterSelect label="Budget" value={filters.budget_range} onChange={(v) => setFilter("budget_range", v)} options={BUDGET_OPTIONS} />
        <FilterSelect label="Timeline" value={filters.timeline} onChange={(v) => setFilter("timeline", v)} options={TIMELINE_OPTIONS} />
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm px-3 py-2 text-slate-400 hover:text-red-400 transition-colors pb-2"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <div className="ml-auto text-slate-500 text-xs pb-2">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3 p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
              {selectedIds.length} selected
            </span>
            <button
              onClick={clearSelection}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" /> Clear selection
            </button>
          </div>
          <button
            onClick={() => setBulkOpen(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            <Layers className="w-4 h-4" /> Bulk Actions
          </button>
        </motion.div>
      )}

      {/* Bulk action modal */}
      {bulkOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !bulkBusy && setBulkOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-1">Bulk Update Leads</h3>
            <p className="text-slate-400 text-sm mb-5">
              Apply changes to {selectedIds.length} selected lead{selectedIds.length !== 1 ? "s" : ""}.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Move to Pillar (optional)</label>
                <select
                  value={bulkPillar}
                  onChange={(e) => setBulkPillar(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">— No change —</option>
                  {PILLARS.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Update Status (optional)</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">— No change —</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => { setBulkOpen(false); setBulkPillar(""); setBulkStatus(""); }}
                disabled={bulkBusy}
                className="text-sm px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={applyBulk}
                disabled={bulkBusy || (!bulkPillar && !bulkStatus)}
                className="flex items-center gap-2 text-sm px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {bulkBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Kanban board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const items = grouped[pillar.key] || [];
            return (
              <div
                key={pillar.key}
                className={`flex flex-col rounded-xl border ${pillar.accent} bg-slate-950/40 overflow-hidden`}
              >
                {/* Column header */}
                <div className={`bg-gradient-to-r ${pillar.headerBg} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSelectAll(items.map(i => i.id))}
                      className="flex-shrink-0"
                      aria-label="Select all in column"
                    >
                      {items.length > 0 && items.every(i => selectedIds.includes(i.id)) ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/50 hover:text-white" />
                      )}
                    </button>
                    <Icon className="w-4 h-4 text-white" />
                    <h3 className="text-white font-semibold text-sm">{pillar.label}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pillar.chip}`}>
                    {items.length}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={pillar.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2.5 min-h-[200px] space-y-2.5 transition-colors ${
                        snapshot.isDraggingOver ? "bg-slate-800/40" : ""
                      }`}
                    >
                      {items.map((lead, idx) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={idx}
                          isDragDisabled={updatingId === lead.id}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              style={dragProvided.draggableProps.style}
                            >
                              <LeadCard lead={lead} pillar={pillar} isSelected={selectedIds.includes(lead.id)} onToggleSelect={toggleSelect} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {items.length === 0 && (
                        <div className="text-center py-8 text-slate-600 text-xs">
                          No leads in this pillar
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}