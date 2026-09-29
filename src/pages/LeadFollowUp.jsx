import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Send, Mail, Filter, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const EMAIL_TEMPLATES = {
  intro: {
    name: 'Introduction',
    subject: 'Discussing {{service}} for {{company}}',
    body: `Hi {{name}},

I hope this email finds you well. I came across {{company}} and was impressed by your work in {{service}}.

I'd love to discuss how we can help strengthen your security posture. Would you have 15 minutes this week?

Looking forward to connecting!

Best regards,
Asaad Morman
Cybersecurity Professional`
  },
  followup: {
    name: 'Follow-up',
    subject: 'Quick Check-in - {{name}}',
    body: `Hi {{name}},

I wanted to follow up on the proposal we discussed for {{service}}.

Do you have any questions or would you like to schedule a next steps call?

Looking forward to hearing from you!

Best regards,
Asaad Morman`
  },
  proposal: {
    name: 'Proposal Follow-up',
    subject: 'Your {{service}} Proposal',
    body: `Hi {{name}},

I've prepared a customized proposal for {{company}} addressing your security needs.

When would be a good time to review it together?

Best regards,
Asaad Morman`
  }
};

export default function LeadFollowUp() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('intro');
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    body: ''
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
      loadLeads();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterLeads();
  }, [leads, statusFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Lead.list('-created_date', 100);
      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;
    if (statusFilter !== 'all') {
      filtered = leads.filter(l => l.status === statusFilter);
    }
    setFilteredLeads(filtered);
  };

  const applyTemplate = (templateKey) => {
    if (!selectedLead) return;
    const template = EMAIL_TEMPLATES[templateKey];
    const service = selectedLead.service_interest?.replace(/-/g, ' ') || 'our services';
    
    setFormData({
      subject: template.subject
        .replace('{{name}}', selectedLead.name)
        .replace('{{company}}', selectedLead.company || 'your company')
        .replace('{{service}}', service),
      body: template.body
        .replace('{{name}}', selectedLead.name)
        .replace('{{company}}', selectedLead.company || 'your company')
        .replace('{{service}}', service)
    });
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setShowForm(true);
    setFormData({ subject: '', body: '' });
  };

  const handleSendEmail = async () => {
    if (!selectedLead || !formData.subject || !formData.body) {
      alert('Please fill in subject and body');
      return;
    }

    setSending(true);
    try {
      // Create email follow-up record
      const emailRecord = await base44.entities.EmailFollowUp.create({
        recipient_email: selectedLead.email,
        recipient_name: selectedLead.name,
        subject: formData.subject,
        body: formData.body,
        template: selectedTemplate,
        status: 'draft',
        related_contact_id: selectedLead.id,
        contact_source: 'lead'
      });

      // Send the email
      await base44.functions.invoke('sendFollowUpEmail', { followUpId: emailRecord.id });

      // Mark lead as contacted
      await base44.entities.Lead.update(selectedLead.id, {
        status: selectedLead.status === 'new' ? 'contacted' : selectedLead.status
      });

      alert('Email sent successfully!');
      setSelectedLead(null);
      setShowForm(false);
      setFormData({ subject: '', body: '' });
      await loadLeads();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const getLeadScore = (lead) => {
    if (lead.score) return Math.round(lead.score);
    
    let score = 50;
    if (lead.budget_range && !lead.budget_range.startsWith('under')) score += 10;
    if (lead.timeline && lead.timeline !== 'future') score += 15;
    if (lead.service_interest) score += 10;
    return Math.min(100, score);
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'contacted': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'qualified': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'proposal-sent': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      'closed-won': 'bg-green-500/10 text-green-400 border-green-500/30',
      'closed-lost': 'bg-red-500/10 text-red-400 border-red-500/30'
    };
    return colors[status] || colors['new'];
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Lead Follow-ups</h1>
          
          <div className="flex gap-2 flex-wrap mb-6">
            {['all', 'new', 'contacted', 'qualified', 'proposal-sent', 'closed-won'].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                size="sm"
              >
                <Filter className="w-3 h-3 mr-1" />
                {status === 'all' ? 'All Leads' : status.replace('-', ' ')} ({filteredLeads.filter(l => status === 'all' || l.status === status).length})
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-2">
            {loading ? (
              <p className="text-slate-400 text-center py-12">Loading leads...</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-slate-400 text-center py-12">No leads found</p>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead, idx) => {
                  const score = getLeadScore(lead);
                  return (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectLead(lead)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLead?.id === lead.id
                          ? 'bg-cyan-500/10 border-cyan-500/50'
                          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{lead.name}</h3>
                          <p className="text-sm text-slate-400">{lead.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {score >= 70 && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{lead.email}</span>
                        {lead.service_interest && (
                          <span className="text-slate-400">{lead.service_interest.replace(/-/g, ' ')}</span>
                        )}
                        {score && (
                          <span className="text-cyan-400 font-semibold">Score: {score}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Composer */}
          {selectedLead && showForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-24 h-fit"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Compose Email
              </h2>

              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-3">To: <span className="text-white font-medium">{selectedLead.name}</span></p>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Templates</label>
                <div className="flex gap-2 flex-col">
                  {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(key);
                        applyTemplate(key);
                      }}
                      className={selectedTemplate === key ? 'border-cyan-500 bg-cyan-500/10' : ''}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Body</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    rows="8"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Email body"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSendEmail}
                    disabled={sending || !formData.subject || !formData.body}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Email'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedLead(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}