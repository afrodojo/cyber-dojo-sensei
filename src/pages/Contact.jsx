import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/seo/SEOHead";
import LiveChatWidget from "../components/chat/LiveChatWidget";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    phone: "",
    message: "",
    service_interest: "other",
    audience_type: "general-inquirer"
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Save to Lead entity
      await base44.entities.Lead.create({
        ...formData,
        status: "new"
      });
      
      // Sync to HubSpot
      await base44.functions.invoke('syncContactToHubSpot', formData);
      
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        title: "",
        phone: "",
        message: "",
        service_interest: "other",
        audience_type: "general-inquirer"
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "cyberdojosensei@gmail.com" },
    { icon: Phone, label: "Phone", value: "657-658-5859" },
    { icon: MapPin, label: "Location", value: "Fredericksburg, VA" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <SEOHead
        title="Contact Asaad Morman | Cybersecurity Professional"
        description="Get in touch with Asaad Morman for cybersecurity consulting, red team operations, training, or speaking engagements."
      />
      <LiveChatWidget pageName="Contact" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Let's Connect
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have questions about cybersecurity services, training, or speaking opportunities? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8"
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 text-sm">Message sent successfully! I'll get back to you soon.</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Your title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">I am a: <span className="text-cyan-400">*</span></label>
                <select
                  name="audience_type"
                  value={formData.audience_type}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  <option value="employer">Employer / Business</option>
                  <option value="career-seeker">Career Seeker / Professional</option>
                  <option value="educator">Educator / Institution</option>
                  <option value="general-inquirer">General Inquirer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Service Interest</label>
                <select
                  name="service_interest"
                  value={formData.service_interest}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  <option value="red-team">Red Team Operations</option>
                  <option value="penetration-testing">Penetration Testing</option>
                  <option value="security-consulting">Security Consulting</option>
                  <option value="training">Training</option>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell me more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Whether you need cybersecurity consulting, red team services, training programs, or speaking engagements, I'm here to help. Reach out and let's discuss how I can support your organization's security goals.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex items-center gap-4 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6"
                >
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{info.label}</p>
                    <p className="text-white font-medium">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Response Time</h3>
              <p className="text-slate-400 text-sm">
                I typically respond to inquiries within 24 hours. For urgent matters, please call the number above.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}