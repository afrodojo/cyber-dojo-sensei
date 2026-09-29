import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Briefcase, Lightbulb, MapPin, AlertCircle, Loader2, Plus, CheckCircle2 } from "lucide-react";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const OPPORTUNITY_TYPES = {
  "contracting-public": { label: "Public Contract", icon: Briefcase, color: "bg-blue-500/20" },
  "contracting-private": { label: "Private Contract", icon: Briefcase, color: "bg-purple-500/20" },
  "rd-ask": { label: "R&D Request", icon: Lightbulb, color: "bg-yellow-500/20" },
  "local-need": { label: "Local Need", icon: MapPin, color: "bg-green-500/20" },
  "search-trend": { label: "Search Trend", icon: TrendingUp, color: "bg-cyan-500/20" }
};

export default function OpportunityDashboard() {
  const { isAdmin, loading } = useAdminAccess();
  const [opportunities, setOpportunities] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    type: "search-trend",
    title: "",
    description: "",
    agency_name: "",
    relevance_score: 50
  });

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const opps = await base44.entities.OpportunityData.list('-created_date', 100);
        setOpportunities(opps);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      }
    };
    init();
  }, [isAdmin]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.functions.invoke('websiteOptimizer', {});
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddOpportunity = async () => {
    try {
      await base44.entities.OpportunityData.create(newOpportunity);
      setOpportunities(prev => [newOpportunity, ...prev]);
      setShowForm(false);
      setNewOpportunity({
        type: "search-trend",
        title: "",
        description: "",
        agency_name: "",
        relevance_score: 50
      });
    } catch (error) {
      console.error('Failed to add opportunity:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await base44.entities.OpportunityData.update(id, { status: newStatus });
      setOpportunities(prev =>
        prev.map(opp => opp.id === id ? { ...opp, status: newStatus } : opp)
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Access Denied</p>
        </div>
      </div>
    );
  }

  const newOpportunities = opportunities.filter(o => o.status === 'new').length;
  const reviewedOpportunities = opportunities.filter(o => o.status === 'reviewed').length;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 flex items-center gap-3">
                <Zap className="w-10 h-10 text-cyan-400" />
                Opportunity Dashboard
              </h1>
              <p className="text-slate-400">Track contracting, R&D, and market opportunities to drive website optimization</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Website
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Total Opportunities</p>
              <p className="text-3xl font-bold text-cyan-400">{opportunities.length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">New</p>
              <p className="text-3xl font-bold text-yellow-400">{newOpportunities}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Reviewed</p>
              <p className="text-3xl font-bold text-green-400">{reviewedOpportunities}</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Opportunities List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {opportunities.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <p className="text-slate-400">No opportunities tracked yet</p>
                </div>
              ) : (
                opportunities.map((opp) => {
                  const typeConfig = OPPORTUNITY_TYPES[opp.type];
                  const Icon = typeConfig?.icon;
                  return (
                    <motion.div
                      key={opp.id}
                      layout
                      className={`${typeConfig?.color} border border-slate-700/50 rounded-lg p-4`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {Icon && <Icon className="w-5 h-5 text-slate-300" />}
                            <span className="text-xs font-semibold text-slate-300">{typeConfig?.label}</span>
                            {opp.relevance_score && (
                              <span className="text-xs bg-slate-700/50 px-2 py-1 rounded">
                                {opp.relevance_score}% relevant
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-semibold mb-1">{opp.title}</h3>
                          <p className="text-sm text-slate-300 mb-2">{opp.description}</p>
                          {opp.agency_name && (
                            <p className="text-xs text-slate-400">Agency: {opp.agency_name}</p>
                          )}
                        </div>
                        <select
                          value={opp.status}
                          onChange={(e) => handleStatusUpdate(opp.id, e.target.value)}
                          className="bg-slate-900/50 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="implemented">Implemented</option>
                          <option value="dismissed">Dismissed</option>
                        </select>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Analysis & Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            {showForm ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Add Opportunity</h3>
                <div className="space-y-4">
                  <select
                    value={newOpportunity.type}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, type: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-white"
                  >
                    {Object.entries(OPPORTUNITY_TYPES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newOpportunity.title}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-white placeholder:text-slate-500"
                  />
                  <textarea
                    placeholder="Description"
                    value={newOpportunity.description}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-white placeholder:text-slate-500 resize-none h-20"
                  />
                  <input
                    type="text"
                    placeholder="Agency (optional)"
                    value={newOpportunity.agency_name}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, agency_name: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-white placeholder:text-slate-500"
                  />
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Relevance Score: {newOpportunity.relevance_score}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newOpportunity.relevance_score}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, relevance_score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddOpportunity} className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                      Add
                    </Button>
                    <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              analysis && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Optimization Analysis
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1 font-semibold">Priority Updates</p>
                      <ul className="text-slate-300 space-y-1">
                        {analysis.analysis?.priority_updates?.slice(0, 3).map((update, idx) => (
                          <li key={idx} className="text-xs">• {update.page}: {update.update}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1 font-semibold">Top Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {analysis.analysis?.keyword_recommendations?.slice(0, 4).map((kw, idx) => (
                          <span key={idx} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1 font-semibold">Summary</p>
                      <p className="text-slate-300 text-xs">{analysis.analysis?.opportunity_summary}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}