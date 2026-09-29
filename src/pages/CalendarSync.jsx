import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarSync() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [scheduledBriefings, setScheduledBriefings] = useState([]);
  const [loading, setLoading] = useState(false);

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
      loadBriefings();
    }
  }, [isAdmin]);

  const loadBriefings = async () => {
    setLoading(true);
    try {
      const briefings = await base44.entities.ExecutiveBriefing.list('-created_date', 100);
      const scheduled = briefings.filter(b => b.scheduled_datetime && b.status !== 'cancelled');
      setScheduledBriefings(scheduled);
    } catch (error) {
      console.error('Failed to load briefings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result = await base44.functions.invoke('syncCalendarEvents', {});
      setSyncStatus(result);
    } catch (error) {
      setSyncStatus({
        success: false,
        error: error.message
      });
    } finally {
      setSyncing(false);
    }
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
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Google Calendar Sync</h1>
              <p className="text-slate-400">Sync your executive briefing appointments to Google Calendar</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
          >
            <p className="text-sm text-slate-400 mb-1">Scheduled Briefings</p>
            <p className="text-2xl font-bold text-cyan-400">{scheduledBriefings.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
          >
            <p className="text-sm text-slate-400 mb-1">Status</p>
            {syncStatus ? (
              <p className={`text-lg font-bold ${syncStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                {syncStatus.success ? 'Synced' : 'Failed'}
              </p>
            ) : (
              <p className="text-lg font-bold text-slate-400">Ready</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
          >
            <Button
              onClick={handleSync}
              disabled={syncing || scheduledBriefings.length === 0}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {syncing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Sync Result */}
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-lg border ${
              syncStatus.success
                ? 'bg-green-500/10 border-green-500/50'
                : 'bg-red-500/10 border-red-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {syncStatus.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
              )}
              <div>
                <h3 className={`font-semibold ${syncStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                  {syncStatus.success ? 'Sync Completed' : 'Sync Failed'}
                </h3>
                {syncStatus.success && (
                  <p className="text-sm text-slate-300 mt-1">
                    Successfully synced <span className="font-semibold text-green-400">{syncStatus.synced}</span> of{' '}
                    <span className="font-semibold">{syncStatus.total}</span> briefings to Google Calendar
                  </p>
                )}
                {syncStatus.error && (
                  <p className="text-sm text-slate-300 mt-1">{syncStatus.error}</p>
                )}
                {syncStatus.errors && syncStatus.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {syncStatus.errors.map((err, idx) => (
                      <p key={idx} className="text-xs text-red-400">{err}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Scheduled Briefings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Scheduled Briefings</h2>
          </div>

          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading briefings...</p>
          ) : scheduledBriefings.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No scheduled briefings to sync</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {scheduledBriefings.map((briefing, idx) => (
                <motion.div
                  key={briefing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-6 py-4 hover:bg-slate-700/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{briefing.name}</h3>
                      <p className="text-sm text-slate-400">{briefing.company}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>📅 {new Date(briefing.scheduled_datetime).toLocaleDateString()}</span>
                        <span>⏰ {new Date(briefing.scheduled_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>📍 {briefing.meeting_type === 'virtual' ? 'Virtual' : 'In-person'}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {briefing.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}