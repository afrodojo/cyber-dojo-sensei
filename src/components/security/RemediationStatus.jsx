import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RemediationStatus() {
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [results, setResults] = useState(null);

  const handleRunRemediation = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('autoRemediateSecurityIssues', {});
      setResults(result);
      setLastRun(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Remediation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Auto-Remediation</h3>
        <Button
          onClick={handleRunRemediation}
          disabled={loading}
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            'Run Now'
          )}
        </Button>
      </div>

      {lastRun && (
        <p className="text-sm text-slate-400 mb-4">Last run: {lastRun}</p>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{results.remediations_performed} issues remediated</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {results.details.form_length_fixes > 0 && (
              <div className="bg-slate-700/50 rounded p-2">
                <p className="text-slate-400">Form Length Fixes</p>
                <p className="text-lg font-semibold text-white">{results.details.form_length_fixes}</p>
              </div>
            )}
            {results.details.inactive_subscriber_emails > 0 && (
              <div className="bg-slate-700/50 rounded p-2">
                <p className="text-slate-400">Reconfirmation Emails</p>
                <p className="text-lg font-semibold text-white">{results.details.inactive_subscriber_emails}</p>
              </div>
            )}
            {results.details.spam_deletions > 0 && (
              <div className="bg-slate-700/50 rounded p-2">
                <p className="text-slate-400">Spam Deleted</p>
                <p className="text-lg font-semibold text-white">{results.details.spam_deletions}</p>
              </div>
            )}
            {results.details.sensitive_data_sanitized > 0 && (
              <div className="bg-red-500/10 rounded p-2 border border-red-500/30">
                <p className="text-red-300">Data Sanitized</p>
                <p className="text-lg font-semibold text-red-300">{results.details.sensitive_data_sanitized}</p>
              </div>
            )}
            {results.details.malformed_deleted > 0 && (
              <div className="bg-slate-700/50 rounded p-2">
                <p className="text-slate-400">Malformed Deleted</p>
                <p className="text-lg font-semibold text-white">{results.details.malformed_deleted}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}