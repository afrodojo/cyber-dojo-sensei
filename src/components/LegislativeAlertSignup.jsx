import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Scale, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TOPICS = [
  { id: 'cybersecurity', label: 'Cybersecurity Laws', icon: Shield, color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10' },
  { id: '2a_laws', label: '2A & Firearms Laws', icon: Scale, color: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-500/10' },
];

export default function LegislativeAlertSignup({ className = '' }) {
  const [form, setForm] = useState({ name: '', email: '', interests: ['cybersecurity', '2a_laws'] });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : [...f.interests, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.interests.length) { setError('Please select at least one topic.'); return; }
    setStatus('loading');
    setError('');
    try {
      // Check for duplicate
      const existing = await base44.entities.LegislativeAlertSubscriber.filter({ email: form.email });
      if (existing.length > 0) {
        await base44.entities.LegislativeAlertSubscriber.update(existing[0].id, {
          name: form.name,
          interests: form.interests,
          active: true
        });
      } else {
        await base44.entities.LegislativeAlertSubscriber.create({
          email: form.email,
          name: form.name,
          interests: form.interests,
          active: true
        });
      }
      setStatus('success');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-slate-800/50 border border-green-500/30 rounded-2xl p-8 text-center ${className}`}
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">You're subscribed!</h3>
        <p className="text-slate-400 text-sm">You'll receive your first weekly legislative alert this Monday. Stay informed, stay protected.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-8 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">Weekly Legislative Alerts</h3>
          <p className="text-slate-400 text-xs">Cybersecurity & 2A law changes — every Monday</p>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Get AI-curated summaries of new federal and state legislation affecting cybersecurity and firearms rights, delivered weekly to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Track Topics</label>
          <div className="flex gap-3">
            {TOPICS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleInterest(t.id)}
                className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  form.interests.includes(t.id)
                    ? `${t.bg} ${t.border} ${t.color}`
                    : 'border-slate-700 text-slate-500 hover:border-slate-600'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none text-sm transition-colors"
          />
        </div>

        <div>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none text-sm transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all"
        >
          {status === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing...</>
          ) : (
            <><Bell className="w-4 h-4" /> Subscribe to Alerts</>
          )}
        </button>

        <p className="text-center text-slate-600 text-xs">No spam. Unsubscribe anytime by replying to any alert email.</p>
      </form>
    </motion.div>
  );
}