import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExecutiveBriefing } from "@/entities/ExecutiveBriefing";
import { Calendar, Clock, User, Building, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExecutiveBriefings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    topics_of_interest: [],
    current_challenges: "",
    meeting_type: "virtual"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topicOptions = [
    "Cybersecurity Strategy",
    "Risk Assessment",
    "Incident Response Planning",
    "Compliance Requirements",
    "Security Budget Planning",
    "Team Development",
    "Threat Landscape Overview",
    "Zero Trust Implementation",
    "Third-Party Risk Management",
    "Executive Reporting"
  ];

  const handleTopicToggle = (topic) => {
    const topics = formData.topics_of_interest.includes(topic)
      ? formData.topics_of_interest.filter(t => t !== topic)
      : [...formData.topics_of_interest, topic];
    
    setFormData({...formData, topics_of_interest: topics});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await ExecutiveBriefing.create(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    }
    
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Briefing Request Submitted</h2>
                <p className="text-slate-300 mb-6">
                  Thank you for your interest in an executive cybersecurity briefing. 
                  I'll review your request and get back to you within 24 hours to schedule our session.
                </p>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Executive Security Briefing
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Schedule a 30-minute executive briefing to discuss your organization's cybersecurity posture, 
            current threats, and strategic security planning.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>30-minute focused session</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Tailored to your industry</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Actionable recommendations</span>
            </div>
          </div>
        </motion.div>

        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Company *
                  </label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Executive Title *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="CEO, CTO, CISO, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Preferred Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Preferred Time
                  </label>
                  <Input
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({...formData, preferred_time: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="e.g., 2:00 PM EST"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Meeting Type
                  </label>
                  <Select
                    value={formData.meeting_type}
                    onValueChange={(value) => setFormData({...formData, meeting_type: value})}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Meeting</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Topics of Interest (select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {topicOptions.map((topic) => (
                    <div
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        formData.topics_of_interest.includes(topic)
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.topics_of_interest.includes(topic)}
                          onChange={() => {}}
                          className="rounded"
                        />
                        <span className="text-sm">{topic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Security Challenges
                </label>
                <Textarea
                  value={formData.current_challenges}
                  onChange={(e) => setFormData({...formData, current_challenges: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white h-24"
                  placeholder="Describe your current cybersecurity challenges or concerns..."
                />
              </div>

              <div className="pt-6 border-t border-slate-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3"
                >
                  {isSubmitting ? "Submitting Request..." : "Request Executive Briefing"}
                </Button>
                
                <p className="text-xs text-slate-400 mt-4 text-center">
                  I'll review your request and contact you within 24 hours to schedule the briefing
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}