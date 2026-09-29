import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const INQUIRY_TYPES = [
  { value: "Partnership", label: "Research Partnership", description: "Joint research or co-authorship opportunities" },
  { value: "Consulting", label: "Consulting Engagement", description: "Apply Sentinel Ecosystem to your organization" },
  { value: "Academic Inquiry", label: "Academic Inquiry", description: "Scholarly exchange, citations, or peer review" },
  { value: "Investment", label: "Investment / Licensing", description: "Commercialization or IP licensing interest" },
  { value: "Government / Defense", label: "Government / Defense", description: "Federal program integration or procurement" },
];

export default function SentinelInquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", inquiry_type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.functions.invoke("createSentinelDeal", form);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-cyan-400" />
        </div>
        <h4 className="text-xl font-bold text-white mb-2">Inquiry Received</h4>
        <p className="text-slate-400 max-w-sm mx-auto">Thank you for your interest in the Sentinel Ecosystem. I'll review your inquiry and respond within 48 hours.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mt-20 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/60 backdrop-blur-md p-8 md:p-12"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-500/30 rounded-full px-5 py-2 mb-4 backdrop-blur-sm">
          <FlaskConical className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-medium text-sm">Research Collaboration</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">Connect with the Research</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          Interested in partnering, consulting, or collaborating on the Sentinel Ecosystem? Select your inquiry type below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Inquiry Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Inquiry Type *</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {INQUIRY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, inquiry_type: type.value }))}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  form.inquiry_type === type.value
                    ? "border-cyan-500 bg-cyan-500/10 text-white"
                    : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                }`}
              >
                <div className="font-semibold text-sm mb-1">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Dr. Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="you@institution.edu"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Organization / Institution</label>
          <input
            type="text" name="organization" value={form.organization} onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="University, agency, or company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tell me about your interest *</label>
          <textarea
            name="message" value={form.message} onChange={handleChange} required rows={4}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
            placeholder="Describe how you'd like to engage with the Sentinel Ecosystem research..."
          />
        </div>

        <Button
          type="submit"
          disabled={submitting || !form.inquiry_type}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold disabled:opacity-50"
        >
          <Send className="w-4 h-4 mr-2" />
          {submitting ? "Submitting..." : "Submit Inquiry"}
        </Button>
      </form>
    </motion.div>
  );
}