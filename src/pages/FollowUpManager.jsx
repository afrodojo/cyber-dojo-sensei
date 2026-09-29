import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Mail, Plus, Send, Edit2, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FollowUpManager() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sending, setSending] = useState(null);
  const [formData, setFormData] = useState({
    contact_email: '',
    contact_name: '',
    company: '',
    subject: '',
    body: '',
    campaign_type: 'check-in'
  });

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
      loadFollowUps();
    }
  }, [isAdmin]);

  const loadFollowUps = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.FollowUp.list('-created_date', 100);
      setFollowUps(data);
    } catch (error) {
      console.error('Failed to load follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await base44.entities.FollowUp.update(editing.id, formData);
        setFollowUps(prev => prev.map(f => f.id === editing.id ? { ...f, ...formData } : f));
      } else {
        const newFollowUp = await base44.entities.FollowUp.create(formData);
        setFollowUps(prev => [newFollowUp, ...prev]);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      contact_email: '',
      contact_name: '',
      company: '',
      subject: '',
      body: '',
      campaign_type: 'check-in'
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSend = async (id) => {
    setSending(id);
    try {
      await base44.functions.invoke('sendFollowUpEmail', { followUpId: id });
      await loadFollowUps();
    } catch (error) {
      console.error('Send failed:', error);
    } finally {
      setSending(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this follow-up?')) {
      try {
        await base44.entities.FollowUp.delete(id);
        setFollowUps(prev => prev.filter(f => f.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const filteredFollowUps = statusFilter === 'all' 
    ? followUps 
    : followUps.filter(f => f.status === statusFilter);

  const statusColors = {
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    sent: 'bg-green-500/10 text-green-400 border-green-500/30',
    failed: 'bg-red-500/10 text-red-400 border-red-500/30'
  };

  const statusIcons = {
    draft: <Clock className="w-4 h-4" />,
    scheduled: <Clock className="w-4 h-4" />,
    sent: <CheckCircle className="w-4 h-4" />,
    failed: <AlertCircle className="w-4 h-4" />
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <p className="text-xl text-slate-400">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white">Follow-Up Manager</h1>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Follow-Up
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            {['all', 'draft', 'scheduled', 'sent', 'failed'].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                size="sm"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({followUps.filter(f => status === 'all' || f.status === status).length})
              </Button>
            ))}
          </div>
        </motion.div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{editing ? 'Edit Follow-Up' : 'Create Follow-Up'}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Contact Email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                required
                className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder:text-slate-400"
              />
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
                className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder:text-slate-400"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder:text-slate-400"
              />
              <select
                value={formData.campaign_type}
                onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
                className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
              >
                <option value="check-in">Check-in</option>
                <option value="lead-nurture">Lead Nurture</option>
                <option value="proposal-follow-up">Proposal Follow-up</option>
                <option value="post-meeting">Post-Meeting</option>
                <option value="reconnect">Reconnect</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Email Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder:text-slate-400 mb-4"
            />
            <textarea
              placeholder="Email Body (HTML supported)"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              required
              rows="6"
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder:text-slate-400 mb-4"
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                {editing ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </motion.form>
        )}

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading follow-ups...</p>
        ) : filteredFollowUps.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No follow-ups found</p>
        ) : (
          <div className="space-y-4">
            {filteredFollowUps.map((followUp, idx) => (
              <motion.div
                key={followUp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${statusColors[followUp.status]}`}>
                        {statusIcons[followUp.status]}
                        {followUp.status}
                      </span>
                      <span className="text-xs text-slate-400">{followUp.campaign_type.replace('-', ' ')}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{followUp.subject}</h3>
                    <p className="text-sm text-slate-400 mb-1">{followUp.contact_name} {followUp.company && `(${followUp.company})`}</p>
                    <p className="text-sm text-slate-300 mb-2 line-clamp-2">{followUp.body}</p>
                    <p className="text-xs text-slate-500">
                      To: {followUp.contact_email} {followUp.sent_date && `• Sent: ${new Date(followUp.sent_date).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {followUp.status === 'draft' && (
                      <>
                        <Button
                          onClick={() => handleSend(followUp.id)}
                          disabled={sending === followUp.id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                        <Button
                          onClick={() => {
                            setEditing(followUp);
                            setFormData(followUp);
                            setShowForm(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleDelete(followUp.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}