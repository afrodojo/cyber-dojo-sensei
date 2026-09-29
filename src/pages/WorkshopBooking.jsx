import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Shield, CheckCircle, ExternalLink, Tag, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import SEOHead from '../components/seo/SEOHead';

const CATEGORY_COLORS = {
  cybersecurity: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
  firearms: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
  'executive-protection': 'text-violet-400 border-violet-500/40 bg-violet-500/10',
  'red-team': 'text-red-400 border-red-500/40 bg-red-500/10',
  compliance: 'text-green-400 border-green-500/40 bg-green-500/10',
};

function RegistrationModal({ workshop, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('registerForWorkshop', {
        workshopId: workshop.id,
        ...form
      });
      setResult(res.data || res);
      onSuccess?.(workshop.id);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 px-6 py-5 border-b border-slate-700 flex justify-between items-start">
          <div>
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">Register</p>
            <h3 className="text-white font-bold text-lg leading-tight">{workshop.title}</h3>
            <p className="text-slate-400 text-sm mt-1">
              {new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })} · {workshop.start_time}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {result ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h4 className="text-white font-bold text-xl mb-2">
                {result.status === 'confirmed' ? "You're Registered!" : "You're on the Waitlist"}
              </h4>
              <p className="text-slate-400 text-sm mb-6">
                {result.status === 'confirmed'
                  ? 'A confirmation email has been sent with all the details.'
                  : "We'll email you if a spot opens up."}
              </p>
              {result.status === 'confirmed' && result.gcalLink && (
                <a
                  href={result.gcalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Add to Google Calendar
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button onClick={onClose} className="block mt-4 mx-auto text-sm text-slate-500 hover:text-slate-300">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Your name" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Organization</label>
                  <input value={form.organization} onChange={e => setForm(f => ({...f, organization: e.target.value}))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Optional" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Questions / Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Any dietary restrictions, accessibility needs, or questions..." />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Registering...</> : 'Confirm Registration'}
              </Button>
              <p className="text-center text-slate-600 text-xs">You'll receive a confirmation email with a Google Calendar link.</p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function WorkshopCard({ workshop, onRegister }) {
  const spotsLeft = workshop.max_attendees ? workshop.max_attendees - (workshop.registration_count || 0) : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const colorClass = CATEGORY_COLORS[workshop.category] || 'text-slate-400 border-slate-500/40 bg-slate-500/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all group"
    >
      {workshop.image_url && (
        <img src={workshop.image_url} alt={workshop.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${colorClass}`}>
            {workshop.category?.replace('-', ' ')}
          </span>
          {workshop.price === 0
            ? <span className="text-green-400 text-sm font-bold">Free</span>
            : <span className="text-white text-sm font-bold">${workshop.price}</span>
          }
        </div>

        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{workshop.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{workshop.description}</p>

        <div className="space-y-1.5 mb-5 text-sm text-slate-400">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            {new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            {workshop.start_time}{workshop.end_time ? ` – ${workshop.end_time}` : ''}
          </div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            {workshop.meeting_link ? 'Online (Link sent after registration)' : workshop.location || 'TBD'}
          </div>
          {spotsLeft !== null && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              {isFull ? <span className="text-orange-400 font-medium">Sold out — join waitlist</span>
                : <span className={spotsLeft <= 5 ? 'text-orange-400 font-medium' : ''}>{spotsLeft} spots remaining</span>}
            </div>
          )}
        </div>

        <Button
          onClick={() => onRegister(workshop)}
          className={`w-full font-semibold ${isFull
            ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'}`}
        >
          {isFull ? 'Join Waitlist' : 'Register Now'}
        </Button>
      </div>
    </motion.div>
  );
}

export default function WorkshopBooking() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadWorkshops = async () => {
    try {
      const data = await base44.entities.Workshop.filter({ status: 'upcoming' }, 'date', 50);
      setWorkshops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWorkshops(); }, []);

  const categories = ['all', ...new Set(workshops.map(w => w.category).filter(Boolean))];
  const filtered = filter === 'all' ? workshops : workshops.filter(w => w.category === filter);

  return (
    <div className="min-h-screen bg-slate-950 pt-8 pb-20">
      <SEOHead
        title="Security Workshops & Training | Asaad Morman"
        description="Register for cybersecurity, firearms, and executive protection workshops led by Asaad Morman. Spots are limited — book yours today."
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-5">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Security Workshops</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Hands-on training in cybersecurity, executive protection, and tactical defense — led by Asaad Morman. Register and instantly add to your Google Calendar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                filter === cat
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Workshops' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Workshop Grid */}
      <div className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No upcoming workshops in this category.</p>
            <p className="text-slate-500 text-sm mt-2">Check back soon or <a href="mailto:cyberdojosensai@gmail.com" className="text-cyan-400 hover:underline">contact us</a> about private sessions.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(w => (
              <WorkshopCard key={w.id} workshop={w} onRegister={setSelectedWorkshop} />
            ))}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selectedWorkshop && (
        <RegistrationModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
          onSuccess={() => loadWorkshops()}
        />
      )}
    </div>
  );
}