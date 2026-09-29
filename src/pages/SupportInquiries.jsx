import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Mail, Filter, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [syncing, setSyncing] = useState(false);

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
      loadInquiries();
    }
  }, [isAdmin]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.SupportInquiry.list('-created_date', 50);
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncEmails = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke('readAndCategorizeSupportEmails', {});
      await loadInquiries();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await base44.entities.SupportInquiry.update(id, { status });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const filteredInquiries = selectedCategory === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.category === selectedCategory);

  const categoryColors = {
    'bug': 'bg-red-500/10 text-red-400 border-red-500/30',
    'feature-request': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'billing': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    'account': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'technical-support': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'general-question': 'bg-green-500/10 text-green-400 border-green-500/30',
    'other': 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  };

  const priorityIcons = {
    'urgent': <AlertCircle className="w-4 h-4 text-red-400" />,
    'high': <AlertCircle className="w-4 h-4 text-orange-400" />,
    'medium': <Clock className="w-4 h-4 text-yellow-400" />,
    'low': <Clock className="w-4 h-4 text-slate-400" />
  };

  const statusIcons = {
    'new': <Mail className="w-4 h-4 text-blue-400" />,
    'in-progress': <RefreshCw className="w-4 h-4 text-yellow-400" />,
    'resolved': <CheckCircle className="w-4 h-4 text-green-400" />
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
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white">Support Inquiries</h1>
            <Button
              onClick={syncEmails}
              disabled={syncing}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync from Gmail'}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              All ({inquiries.length})
            </Button>
            {['bug', 'feature-request', 'billing', 'account', 'technical-support', 'general-question'].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat.replace('-', ' ')} ({inquiries.filter(i => i.category === cat).length})
              </Button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No inquiries found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry, idx) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[inquiry.category]}`}>
                        {inquiry.category.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-1">
                        {priorityIcons[inquiry.priority]}
                        <span className="text-xs text-slate-400">{inquiry.priority}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{inquiry.subject}</h3>
                    <p className="text-sm text-slate-400 mb-2">{inquiry.summary}</p>
                    <p className="text-xs text-slate-500">From: {inquiry.from}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {statusIcons[inquiry.status]}
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3 line-clamp-2">{inquiry.body}</p>
                <p className="text-xs text-slate-500">
                  Received: {new Date(inquiry.received_date).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}