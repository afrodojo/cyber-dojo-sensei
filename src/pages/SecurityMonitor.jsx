import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RemediationStatus from "../components/security/RemediationStatus";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function SecurityMonitor() {
  const [issues, setIssues] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const { isAdmin, loading } = useAdminAccess();
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const result = await base44.functions.invoke('scanSecurityIssues', {});
        setIssues(result?.issues || []);
        setRecommendations(result?.recommendations || []);
        setLastScanned(result?.scan_date);
      } catch (error) {
        console.error('Failed to scan security issues:', error);
      }
    };
    init();
  }, [isAdmin]);

  const handleRescan = async () => {
    setScanning(true);
    try {
      const result = await base44.functions.invoke('scanSecurityIssues', {});
      setIssues(result?.issues || []);
      setRecommendations(result?.recommendations || []);
      setLastScanned(result?.scan_date);
    } finally {
      setScanning(false);
    }
  };

  const handleChatWithAgent = async () => {
    const conversation = await base44.agents.createConversation({
      agent_name: 'security_monitor',
      metadata: { name: 'Security Scan', description: 'Monitor and fix security vulnerabilities' }
    });
    window.location.href = `/SecurityMonitorChat?conv_id=${conversation.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">Security monitoring is restricted to administrators.</p>
        </div>
      </div>
    );
  }

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
                <ShieldAlert className="w-10 h-10 text-cyan-400" />
                Security Monitor
              </h1>
              <p className="text-slate-400 mt-2">Monitor and remediate security vulnerabilities</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRescan}
                disabled={scanning}
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
                Scan Now
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Link to={createPageUrl('AgentChatPage?agent=security_monitor')}>
                  Chat with Agent
                </Link>
              </Button>
            </div>
          </div>
          {lastScanned && (
            <p className="text-sm text-slate-400">Last scanned: {new Date(lastScanned).toLocaleString()}</p>
          )}
        </motion.div>

        {scanning ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-slate-400">Scanning for security issues...</p>
          </div>
        ) : (
          <>
            {/* Issues Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400">Total Issues</p>
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{issues.length}</p>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400">High Severity</p>
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {issues.filter(i => i.severity === 'high').length}
                  </p>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400">Recommendations</p>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{recommendations.length}</p>
                </div>
              </div>
            </motion.div>

            {/* Auto-Remediation Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <RemediationStatus />
            </motion.div>

            {/* Issues List */}
            {issues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Security Issues</h2>
                <div className="space-y-3">
                  {issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 ${
                        issue.severity === 'high'
                          ? 'bg-red-500/10 border-red-500/30'
                          : issue.severity === 'medium'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white capitalize">
                            {issue.type.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-slate-300 mt-1">{issue.message}</p>
                          <p className="text-sm text-slate-400 mt-2">
                            <strong>Fix:</strong> {issue.recommendation}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            issue.severity === 'high'
                              ? 'bg-red-500/20 text-red-300'
                              : issue.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Security Recommendations</h2>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{rec.area}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rec.priority === 'high'
                            ? 'bg-red-500/20 text-red-300'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}
                      >
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-slate-300">{rec.action}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}