import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Send, Plus, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const EMAIL_TEMPLATES = {
  sales: {
    name: 'Sales Follow-up',
    subject: 'Following Up - {{name}}',
    body: `Hi {{name}},

I wanted to follow up on our previous conversation about {{service}}. 

Would you have 15 minutes this week to discuss how we can help?

Best regards,
Asaad Morman`
  },
  support: {
    name: 'Support Follow-up',
    subject: 'Re: Your Support Request',
    body: `Hi {{name}},

I wanted to follow up on your support request. Is there anything else I can help you with?

Best regards,
Support Team`
  },
  engagement: {
    name: 'Engagement Follow-up',
    subject: 'Checking In - {{name}}',
    body: `Hi {{name}},

I hope this email finds you well. I wanted to check in and see if you have any questions or would like to schedule a call.

Looking forward to hearing from you!

Best regards,
Asaad Morman`
  }
};

export default function EmailFollowUp() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('sales');
  const [formData, setFormData] = useState({
    recipient_email: '',
    recipient_name: '',
    subject: '',
    body: '',
    template: 'sales'
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
      const data = await base44.entities.EmailFollowUp.list('-created_date', 50);
      setFollowUps(data);
    } catch (error) {
      console.error('Failed to load follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateKey) => {
    const template = EMAIL_TEMPLATES[templateKey];
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body,
      template: templateKey
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.EmailFollowUp.create({
        ...formData,
        status: 'draft'
      });
      setFormData({
        recipient_email: '',
        recipient_name: '',
        subject: '',
        body: '',
        template: 'sales'
      });
      setShowForm(false);
      await loadFollowUps();
    } catch (error) {
      console.error('Failed to create follow-up:', error);
    }
  };

  const sendEmail = async (id) => {
    try {
      await base44.functions.invoke('sendFollowUpEmail', { followUpId: id });
      await loadFollowUps();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const deleteFollowUp = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await base44.entities.EmailFollowUp.delete(id);
        setFollowUps(prev => prev.filter(f => f.id !== id));
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const statusIcons = {
    draft: <Clock className="w-4 h-4 text-yellow-400" />,
    scheduled: <Clock className="w-4 h-4 text-blue-400" />,
    sent: <CheckCircle className="w-4 h-4 text-green-400" />,
    failed: <AlertCircle className="w-4 h-4 text-red-400" />
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
            <h1 className="text-4xl font-bold text-white">Email Follow-ups</h1>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Follow-up
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Compose Follow-up Email</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Quick Templates</label>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <Button
                    key={key}
                    variant={selectedTemplate === key ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedTemplate(key);
                      applyTemplate(key);
                    }}
                    size="sm"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Email *</label>
                  <input
                    type="email"
                    name="recipient_email"
                    value={formData.recipient_email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Body *</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  required
                  rows="8"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                  placeholder="Email content"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  Create Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading follow-ups...</p>
          </div>
        ) : followUps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No follow-up emails yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followUps.map((followUp, idx) => (
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
                      <div className="flex items-center gap-1">
                        {statusIcons[followUp.status]}
                        <span className="text-xs font-semibold text-slate-400 uppercase">{followUp.status}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{followUp.subject}</h3>
                    <p className="text-sm text-slate-400">To: {followUp.recipient_email}</p>
                    {followUp.recipient_name && (
                      <p className="text-sm text-slate-400">{followUp.recipient_name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {followUp.status === 'draft' && (
                      <Button
                        onClick={() => sendEmail(followUp.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteFollowUp(followUp.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap line-clamp-3 mb-3">{followUp.body}</p>
                <p className="text-xs text-slate-500">
                  Created: {new Date(followUp.created_date).toLocaleDateString()}
                  {followUp.sent_at && ` • Sent: ${new Date(followUp.sent_at).toLocaleDateString()}`}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}