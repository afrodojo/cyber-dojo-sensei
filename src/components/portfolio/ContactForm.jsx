
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader, AlertCircle, CheckCircle, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card"; // Added Card and CardContent
import { Lead } from "@/entities/Lead";
import { SendEmail } from "@/integrations/Core";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        service_interest: "",
        budget_range: "",
        timeline: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const calculateLeadScore = (data) => {
        let score = 0;
        const budgetScores = {
            "under-25k": 10,
            "25k-50k": 20,
            "50k-100k": 40,
            "100k-250k": 60,
            "250k-plus": 80
        };
        const timelineScores = {
            "immediate": 50,
            "1-3-months": 30,
            "3-6-months": 20,
            "6-12-months": 10,
            "future": 5
        };

        if (data.budget_range) {
            score += budgetScores[data.budget_range] || 0;
        }
        if (data.timeline) {
            score += timelineScores[data.timeline] || 0;
        }

        return score;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmissionMessage(null);

        const leadScore = calculateLeadScore(formData);
        const leadData = { ...formData, score: leadScore, status: 'new' };

        try {
            await Lead.create(leadData);

            // Send notification to Asaad
            await SendEmail({
                to: 'AsaadMorman@gmail.com',
                subject: `New Lead from Portfolio: ${formData.name} (Score: ${leadScore})`,
                body: `
                    <h2>New Lead from Portfolio Website</h2>
                    <p><strong>Lead Score:</strong> ${leadScore}/130</p>
                    <ul>
                        <li><strong>Name:</strong> ${formData.name}</li>
                        <li><strong>Company:</strong> ${formData.company || 'N/A'}</li>
                        <li><strong>Email:</strong> ${formData.email}</li>
                        <li><strong>Phone:</strong> ${formData.phone || 'N/A'}</li>
                        <li><strong>Service Interest:</strong> ${formData.service_interest || 'N/A'}</li>
                        <li><strong>Budget Range:</strong> ${formData.budget_range || 'N/A'}</li>
                        <li><strong>Timeline:</strong> ${formData.timeline || 'N/A'}</li>
                    </ul>
                    <p><strong>Message:</strong></p>
                    <p>${formData.message}</p>
                `
            });

            // Send automated thank you email to prospect
            await SendEmail({
                to: formData.email,
                subject: 'Thank you for your cybersecurity inquiry',
                from_name: 'Asaad Morman - Cybersecurity Expert',
                body: `
                    <p>Dear ${formData.name},</p>
                    
                    <p>Thank you for reaching out regarding cybersecurity services. I've received your inquiry and appreciate your interest in strengthening your organization's security posture.</p>
                    
                    <p><strong>What happens next:</strong></p>
                    <ul>
                        <li>I will personally review your inquiry within 24 hours</li>
                        <li>You'll receive a follow-up email or call to discuss your specific needs</li>
                        <li>If appropriate, we'll schedule a consultation to explore how I can help</li>
                    </ul>
                    
                    <p>In the meantime, feel free to explore my portfolio and case studies to learn more about my approach to cybersecurity consulting.</p>
                    
                    <p>Best regards,</p>
                    <p><strong>Asaad Morman</strong><br>
                    Offensive Cybersecurity Subject Matter Expert<br>
                    TS/SCI w/CI Polygraph<br>
                    Email: AsaadMorman@gmail.com<br>
                    Phone: (571) 245-2303</p>
                `
            });

            setSubmissionMessage({
                type: "success",
                text: "Thank you for your inquiry! I'll be in touch within 24 hours to discuss your cybersecurity needs."
            });
            setFormData({
                name: "",
                email: "",
                company: "",
                phone: "",
                service_interest: "",
                budget_range: "",
                timeline: "",
                message: "",
            });
        } catch (error) {
            console.error("Submission failed:", error); // Keep original console error for debugging
            setSubmissionMessage({
                type: "error",
                text: "There was an error sending your message. Please try again or contact me directly at AsaadMorman@gmail.com"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
                    </div>

                    {submissionMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-lg border ${
                                submissionMessage.type === "success" 
                                    ? "bg-green-950/30 border-green-500/30 text-green-300" 
                                    : "bg-red-950/30 border-red-500/30 text-red-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {submissionMessage.type === "success" ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                <p>{submissionMessage.text}</p>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Your Name *"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                            />
                            <Input
                                type="email"
                                placeholder="Email Address *"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Company"
                                value={formData.company}
                                onChange={(e) => handleInputChange("company", e.target.value)}
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                            />
                            <Input
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                            />
                        </div>

                        <Select value={formData.service_interest} onValueChange={(value) => handleInputChange("service_interest", value)}>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                <SelectValue placeholder="Primary Interest" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="red-team">Red Team Operations</SelectItem>
                                <SelectItem value="penetration-testing">Penetration Testing</SelectItem>
                                <SelectItem value="security-consulting">Security Consulting</SelectItem>
                                <SelectItem value="training">Training & Education</SelectItem>
                                <SelectItem value="speaking">Speaking Engagement</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Select value={formData.budget_range} onValueChange={(value) => handleInputChange("budget_range", value)}>
                                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                    <SelectValue placeholder="Budget Range" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="under-25k">Under $25K</SelectItem>
                                    <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                                    <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                                    <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                                    <SelectItem value="250k-plus">$250K+</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                    <SelectValue placeholder="Timeline" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                                    <SelectItem value="1-3-months">1-3 Months</SelectItem>
                                    <SelectItem value="3-6-months">3-6 Months</SelectItem>
                                    <SelectItem value="6-12-months">6-12 Months</SelectItem>
                                    <SelectItem value="future">Future Planning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Textarea
                            placeholder="Tell me about your cybersecurity challenges and objectives... *"
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            required
                            rows={5}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Sending Message...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Meeting Scheduler CTA */}
                    <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
                        <h4 className="text-white font-semibold mb-3">
                            Prefer to schedule a call directly?
                        </h4>
                        <Button 
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-400"
                            onClick={() => window.open('https://calendly.com/asaad-morman', '_blank')}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule a Consultation
                        </Button>
                        <p className="text-xs text-slate-500 mt-2">
                            Book a 30-minute consultation to discuss your security needs
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
