import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Link, Share2, Settings, ActivitySquare, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import FieldMappingForm from '../components/crm/FieldMappingForm';
import SyncLogViewer from '../components/crm/SyncLogViewer';

export default function CRMIntegration() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [crmConfigs, setCrmConfigs] = useState([]);
  const [fieldMappings, setFieldMappings] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCRM, setSelectedCRM] = useState(null);
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [configs, mappings, logs] = await Promise.all([
        base44.entities.CRMConfig.list('-created_date', 10).catch(() => []),
        base44.entities.CRMFieldMapping.list('-created_date', 100).catch(() => []),
        base44.entities.CRMSyncLog.list('-created_date', 50).catch(() => [])
      ]);
      setCrmConfigs(configs);
      setFieldMappings(mappings);
      setSyncLogs(logs);
    } catch (error) {
      console.error('Failed to load CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionStatus = (config) => {
    return config.is_connected ? 'Connected' : 'Not Connected';
  };

  const getStatusColor = (config) => {
    return config.is_connected
      ? 'text-green-400 bg-green-500/10'
      : 'text-yellow-400 bg-yellow-500/10';
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-400">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CRM Integration</h1>
              <p className="text-slate-400">Connect and manage CRM sync with HubSpot and Salesforce</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700">
          {['overview', 'mappings', 'logs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* CRM Connections */}
            <div className="grid md:grid-cols-2 gap-6">
              {['hubspot', 'salesforce'].map((crmName, idx) => {
                const config = crmConfigs.find(c => c.crm_system === crmName);
                return (
                  <motion.div
                    key={crmName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white capitalize">{crmName}</h3>
                        {config && (
                          <p className={`text-sm font-medium mt-1 ${getStatusColor(config)}`}>
                            {getConnectionStatus(config)}
                          </p>
                        )}
                      </div>
                      {config?.is_connected ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>

                    {config && (
                      <div className="space-y-2 text-sm text-slate-400 mb-4">
                        <p>Last sync: {config.last_sync ? new Date(config.last_sync).toLocaleString() : 'Never'}</p>
                        <p>Auto-sync: {config.auto_sync_enabled ? 'Enabled' : 'Disabled'}</p>
                        <p>Sync errors: <span className={config.sync_errors_count > 0 ? 'text-red-400' : 'text-green-400'}>{config.sync_errors_count}</span></p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-col">
                      {!config?.is_connected ? (
                        <Button variant="outline" className="w-full text-xs">
                          <Link className="w-3 h-3 mr-2" />
                          Connect {crmName}
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedCRM(crmName);
                              setShowFieldMapping(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                          >
                            <Settings className="w-3 h-3 mr-2" />
                            Field Mapping
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            <ActivitySquare className="w-3 h-3 mr-2" />
                            Sync Now
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sync Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Sync Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                  <span className="text-slate-300">Push email engagement metrics</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                  <span className="text-slate-300">Push briefing outcomes to deal stages</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                  <span className="text-slate-300">Auto-sync enabled</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Mappings Tab */}
        {activeTab === 'mappings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {showFieldMapping ? (
              <FieldMappingForm crmSystem={selectedCRM} onClose={() => setShowFieldMapping(false)} />
            ) : (
              <div className="space-y-4">
                <Button onClick={() => setShowFieldMapping(true)} className="bg-cyan-600 hover:bg-cyan-700">
                  + Add Field Mapping
                </Button>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700/50">
                    <h3 className="font-semibold text-white">Field Mappings</h3>
                  </div>
                  {fieldMappings.length === 0 ? (
                    <p className="text-slate-400 p-6 text-center">No field mappings configured</p>
                  ) : (
                    <div className="divide-y divide-slate-700/50">
                      {fieldMappings.map((mapping, idx) => (
                        <motion.div
                          key={mapping.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-4 hover:bg-slate-700/20 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">{mapping.app_entity}: {mapping.app_field}</p>
                              <p className="text-sm text-slate-400">→ {mapping.crm_system}: {mapping.crm_field}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${mapping.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {mapping.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SyncLogViewer logs={syncLogs} />
          </motion.div>
        )}
      </div>
    </div>
  );
}