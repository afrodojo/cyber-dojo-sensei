import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Info, BookOpen, Search, ExternalLink, ChevronRight, Star, Filter, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import SEOHead from "../components/seo/SEOHead";

const SECTORS = [
  { id: "all", label: "All Sectors", icon: "🌐" },
  { id: "general", label: "General", icon: "🛡️" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "finance", label: "Finance", icon: "🏦" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "government", label: "Government", icon: "🏛️" },
  { id: "defense", label: "Defense", icon: "⚔️" },
  { id: "physical-security", label: "Physical Security", icon: "🔒" },
  { id: "critical-infrastructure", label: "Critical Infrastructure", icon: "⚡" }
];

const THREAT_CONFIG = {
  info:     { label: "Info",     color: "bg-blue-500/20 text-blue-300 border-blue-500/30",   icon: Info },
  low:      { label: "Low",      color: "bg-green-500/20 text-green-300 border-green-500/30", icon: Shield },
  medium:   { label: "Medium",   color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: AlertTriangle },
  high:     { label: "High",     color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500/20 text-red-300 border-red-500/30",      icon: AlertTriangle }
};

const CATEGORY_CONFIG = {
  advisory:        { label: "Advisory",         color: "bg-purple-500/20 text-purple-300" },
  bulletin:        { label: "Bulletin",          color: "bg-cyan-500/20 text-cyan-300" },
  "best-practice": { label: "Best Practice",    color: "bg-teal-500/20 text-teal-300" },
  "threat-alert":  { label: "Threat Alert",     color: "bg-red-500/20 text-red-300" },
  guidance:        { label: "Guidance",          color: "bg-blue-500/20 text-blue-300" },
  training:        { label: "Training",          color: "bg-green-500/20 text-green-300" }
};

function BulletinCard({ bulletin, onClick }) {
  const threat = THREAT_CONFIG[bulletin.threat_level] || THREAT_CONFIG.info;
  const ThreatIcon = threat.icon;
  const cat = CATEGORY_CONFIG[bulletin.category] || { label: bulletin.category, color: "bg-slate-500/20 text-slate-300" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-slate-800/40 border rounded-xl p-5 cursor-pointer hover:border-cyan-500/50 transition-all duration-200 ${
        bulletin.is_featured ? "border-cyan-500/40" : "border-slate-700/50"
      }`}
      onClick={() => onClick(bulletin)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {bulletin.is_featured && (
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full border ${threat.color}`}>
            <ThreatIcon className="w-3 h-3 inline mr-1" />
            {threat.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
      </div>
      <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-cyan-300 transition-colors leading-snug">{bulletin.title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{bulletin.summary}</p>
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        {bulletin.source && <span className="font-medium text-slate-400">{bulletin.source}</span>}
        {bulletin.published_date && <span>{bulletin.published_date}</span>}
      </div>
    </motion.div>
  );
}

function BulletinDetail({ bulletin, onClose }) {
  const threat = THREAT_CONFIG[bulletin.threat_level] || THREAT_CONFIG.info;
  const ThreatIcon = threat.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${threat.color}`}>
              <ThreatIcon className="w-3 h-3 inline mr-1" />
              {threat.label}
            </span>
            {bulletin.source && (
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">{bulletin.source}</span>
            )}
            {bulletin.published_date && (
              <span className="text-xs text-slate-500">{bulletin.published_date}</span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded transition-colors flex-shrink-0">✕</button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3">{bulletin.title}</h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">{bulletin.summary}</p>

          {bulletin.key_actions?.length > 0 && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-cyan-400 font-semibold text-sm mb-3 uppercase tracking-wider">Recommended Actions</h3>
              <ul className="space-y-2">
                {bulletin.key_actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 font-bold mt-0.5 flex-shrink-0">→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bulletin.content && (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-cyan-300">
              <ReactMarkdown>{bulletin.content}</ReactMarkdown>
            </div>
          )}

          {bulletin.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700">
              {bulletin.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          {bulletin.source_url && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <a
                href={bulletin.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Original Source
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CyberBulletins() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedBulletin, setSelectedBulletin] = useState(null);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === "admin") setIsAdmin(true);
      } catch (_) {}
      await loadBulletins();
      setLoading(false);
    };
    init();
  }, []);

  const loadBulletins = async () => {
    const data = await base44.entities.CyberBulletin.filter({ is_published: true }, "-created_date", 50);
    setBulletins(data);
  };

  const handleFetchNew = async () => {
    setFetching(true);
    try {
      await base44.functions.invoke("fetchAndCurateBulletins", {});
      await loadBulletins();
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const filtered = bulletins.filter(b => {
    const matchesSector = selectedSector === "all" || b.sector === selectedSector;
    const matchesSearch = !search || b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.summary?.toLowerCase().includes(search.toLowerCase()) ||
      b.source?.toLowerCase().includes(search.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const featured = filtered.filter(b => b.is_featured);
  const regular = filtered.filter(b => !b.is_featured);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      <SEOHead
        title="Cyber & Defense Bulletins | Asaad Morman"
        description="Stay informed with the latest cybersecurity advisories, threat alerts, and best practices for education, finance, healthcare, defense, and more."
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cyber & Defense Bulletins</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Curated public advisories, threat alerts, and best practices from CISA, FBI, NSA, DHS, and more — organized by sector to help you stay protected in the digital and physical realm.
            </p>
            {isAdmin && (
              <Button
                onClick={handleFetchNew}
                disabled={fetching}
                className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {fetching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fetching New Bulletins...</> : <><RefreshCw className="w-4 h-4 mr-2" />Fetch Latest Bulletins</>}
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bulletins..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
        </div>

        {/* Sector Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SECTORS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSector(s.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedSector === s.id
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">No bulletins found</p>
            {isAdmin && <p className="text-sm">Click "Fetch Latest Bulletins" to populate the database.</p>}
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Featured Bulletins</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featured.map(b => <BulletinCard key={b.id} bulletin={b} onClick={setSelectedBulletin} />)}
                </div>
              </div>
            )}

            {/* All bulletins */}
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {filtered.length} Bulletin{filtered.length !== 1 ? "s" : ""}
                {selectedSector !== "all" && ` — ${SECTORS.find(s => s.id === selectedSector)?.label}`}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regular.map(b => <BulletinCard key={b.id} bulletin={b} onClick={setSelectedBulletin} />)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulletin Detail Modal */}
      <AnimatePresence>
        {selectedBulletin && (
          <BulletinDetail bulletin={selectedBulletin} onClose={() => setSelectedBulletin(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}