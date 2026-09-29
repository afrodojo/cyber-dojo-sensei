import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Loader2, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const SEVERITY_COLORS = {
  critical: 'bg-red-500/10 border-red-500/30 text-red-300',
  high: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
  medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  low: 'bg-blue-500/10 border-blue-500/30 text-blue-300'
};

export default function ThreatIntelligenceDashboard() {
  const [threats, setThreats] = useState([]);
  const [relevantThreats, setRelevantThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { isAdmin } = useAdminAccess();
  const [lastIngestion, setLastIngestion] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const threats = await base44.entities.ThreatIntelligence.filter(
          { active: true },
          '-published_date',
          50
        );
        setThreats(threats);
      } catch (error) {
        console.error('Failed to load threats:', error);
      }
    };
    init();
  }, []);

  const handleIngestion = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('ingestThreatIntelligence', {});
      setLastIngestion(new Date().toLocaleString());
      
      // Reload threats
      const updated = await base44.entities.ThreatIntelligence.filter(
        { active: true },
        '-published_date',
        50
      );
      setThreats(updated);
    } catch (error) {
      console.error('Ingestion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.functions.invoke('analyzeRelevantThreats', {});
      setRelevantThreats(result?.flagged_threats || []);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">Threat intelligence is restricted to administrators.</p>
        </div>
      </div>
    );
  }

  const criticalThreats = threats.filter(t => t.severity === 'critical' || t.severity === 'high');

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-cyan-400" />
                Threat Intelligence
              </h1>
              <p className="text-slate-400 mt-2">Monitor external threat feeds and identify relevant risks</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleIngestion}
                disabled={loading}
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ingesting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Ingest Feeds
                  </>
                )}
              </Button>

              <Button
                onClick={handleAnalyze}
                disabled={analyzing || threats.length === 0}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Analyze Relevance
                  </>
                )}
              </Button>
            </div>
          </div>

          {lastIngestion && (
            <p className="text-sm text-slate-400">Last ingestion: {lastIngestion}</p>
          )}
        </motion.div>

        {/* Threat Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Total Threats</p>
            <p className="text-3xl font-bold text-white">{threats.length}</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-300 text-sm">Critical/High</p>
            <p className="text-3xl font-bold text-red-300">{criticalThreats.length}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Relevant to Us</p>
            <p className="text-3xl font-bold text-cyan-400">{relevantThreats.length}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Sources Monitored</p>
            <p className="text-3xl font-bold text-white">3</p>
          </div>
        </motion.div>

        {/* Relevant Threats */}
        {relevantThreats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Relevant to Your Business</h2>
            <div className="space-y-3">
              {relevantThreats.map((threat, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 ${SEVERITY_COLORS[threat.severity] || SEVERITY_COLORS.medium}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{threat.threat_title}</h3>
                      <p className="text-sm opacity-90 mb-2">{threat.impact}</p>
                      <p className="text-sm opacity-75">
                        <strong>Action:</strong> {threat.recommendation}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold">{threat.relevance_score}/10</div>
                      <p className="text-xs opacity-75">Relevance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Threats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">All Threat Feeds</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {threats.map((threat, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-3 ${SEVERITY_COLORS[threat.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{threat.title}</h4>
                    <p className="text-sm opacity-75 line-clamp-2">{threat.description}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs opacity-75">{threat.source}</span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-white/10">
                      {threat.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}