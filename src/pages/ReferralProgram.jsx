import React, { useState } from "react";
import { motion } from "framer-motion";
import { Referral } from "@/entities/Referral";
import { Users, Gift, DollarSign, CheckCircle2, User, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReferralProgram() {
  const [formData, setFormData] = useState({
    referrer_name: "",
    referrer_email: "",
    referrer_company: "",
    referred_name: "",
    referred_email: "",
    referred_company: "",
    relationship: "",
    services_needed: "",
    urgency: "medium",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await Referral.create(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Referral submission error:", error);
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
                
                <h2 className="text-2xl font-bold text-white mb-4">Referral Submitted Successfully</h2>
                <p className="text-slate-300 mb-6">
                  Thank you for the referral! I'll reach out to your contact within 48 hours. 
                  You'll be notified about the referral status and any applicable rewards.
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Referral Program
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Know an organization that could benefit from expert cybersecurity services? 
            Refer them to us and earn rewards for successful engagements.
          </p>
        </motion.div>

        {/* Program Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 text-center">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Earn Rewards</h3>
                <p className="text-slate-300 text-sm">
                  Receive up to 10% commission on successful referrals that lead to signed contracts
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Help Others</h3>
                <p className="text-slate-300 text-sm">
                  Connect organizations with the cybersecurity expertise they need to stay secure
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 text-center">
              <CardContent className="p-6">
                <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Easy Process</h3>
                <p className="text-slate-300 text-sm">
                  Simple referral form with tracking and regular updates on referral status
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Referral Form */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Submit a Referral</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Your Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-400" />
                  Your Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name *
                    </label>
                    <Input
                      required
                      value={formData.referrer_name}
                      onChange={(e) => setFormData({...formData, referrer_name: e.target.value})}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.referrer_email}
                      onChange={(e) => setFormData({...formData, referrer_email: e.target.value})}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Company
                  </label>
                  <Input
                    value={formData.referrer_company}
                    onChange={(e) => setFormData({...formData, referrer_company: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Referral Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  Referral Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Contact Name *
                    </label>
                    <Input
                      required
                      value={formData.referred_name}
                      onChange={(e) => setFormData({...formData, referred_name: e.target.value})}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.referred_email}
                      onChange={(e) => setFormData({...formData, referred_email: e.target.value})}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company Name *
                  </label>
                  <Input
                    required
                    value={formData.referred_company}
                    onChange={(e) => setFormData({...formData, referred_company: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Relationship & Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Relationship to This Contact
                  </label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="e.g., Former colleague, business partner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Urgency Level
                  </label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({...formData, urgency: value})}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - No rush</SelectItem>
                      <SelectItem value="medium">Medium - Standard follow-up</SelectItem>
                      <SelectItem value="high">High - Priority contact</SelectItem>
                      <SelectItem value="urgent">Urgent - Immediate need</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Services Needed
                </label>
                <Input
                  value={formData.services_needed}
                  onChange={(e) => setFormData({...formData, services_needed: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="e.g., Red team assessment, security consulting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Additional Notes
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white h-24"
                  placeholder="Any additional context about their security needs or situation..."
                />
              </div>

              <div className="pt-6 border-t border-slate-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
                >
                  {isSubmitting ? "Submitting Referral..." : "Submit Referral"}
                </Button>
                
                <p className="text-xs text-slate-400 mt-4 text-center">
                  All referrals are handled confidentially and professionally
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}