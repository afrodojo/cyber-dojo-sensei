import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';

export default function SyncLogViewer({ logs }) {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusIcon = (status) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-400" />;
    return <AlertCircle className="w-4 h-4 text-yellow-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'success') return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (status === 'error') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-white">Sync Logs</h3>
      </div>

      {logs.length === 0 ? (
        <p className="text-slate-400 p-6 text-center">No sync logs available</p>
      ) : (
        <div className="divide-y divide-slate-700/50">
          {logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-slate-700/20 transition-colors"
            >
              <button
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(log.status)}
                  <div>
                    <p className="font-medium text-white capitalize">{log.sync_type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-slate-400">{log.entity_type} • {new Date(log.created_date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === log.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expandedId === log.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-700/50 bg-slate-900/30 p-4 space-y-3"
                >
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Message</p>
                    <p className="text-sm text-slate-300">{log.message}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Sync Time</p>
                    <p className="text-sm text-slate-300">{log.duration_ms}ms</p>
                  </div>

                  {log.crm_record_id && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">CRM Record ID</p>
                      <p className="text-sm text-slate-300 font-mono">{log.crm_record_id}</p>
                    </div>
                  )}

                  {log.data_synced && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Data Synced</p>
                      <pre className="text-xs bg-slate-800 p-2 rounded overflow-x-auto text-slate-300">
                        {JSON.stringify(JSON.parse(log.data_synced), null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.error_details && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Error Details</p>
                      <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded">{log.error_details}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}