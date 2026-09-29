import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What types of cybersecurity services do you offer?",
      answer: "I specialize in offensive cybersecurity services including red team operations, advanced penetration testing, security architecture reviews, incident response, and cybersecurity training. My focus is on advanced threat emulation and helping organizations understand their real-world security posture against sophisticated adversaries."
    },
    {
      question: "What is your security clearance status?",
      answer: "I hold an active TS/SCI clearance with CI Polygraph, enabling me to work on classified government systems and with federal agencies. This clearance is current and regularly updated through the appropriate channels."
    },
    {
      question: "How long does a typical red team engagement take?",
      answer: "Red team engagements typically range from 6-12 weeks depending on scope and complexity. This includes planning, execution, analysis, and comprehensive reporting phases. I work closely with clients to establish realistic timelines that align with their business needs and security objectives."
    },
    {
      question: "Do you work with both government and commercial clients?",
      answer: "Yes, I work with both federal government agencies and commercial enterprises. My experience spans Fortune 500 companies, defense contractors, healthcare organizations, and various government departments. Each engagement is tailored to the specific regulatory and security requirements of the client."
    },
    {
      question: "What makes your approach different from other cybersecurity consultants?",
      answer: "My approach combines 15+ years of federal cybersecurity experience with 7 years of Marine Corps leadership and real-world business ownership. I focus on practical, actionable security improvements rather than just finding vulnerabilities. My military background ensures disciplined, methodical execution with clear communication to stakeholders at all levels."
    },
    {
      question: "Can you help with compliance requirements (FISMA, HIPAA, PCI-DSS)?",
      answer: "Absolutely. I have extensive experience helping organizations achieve and maintain compliance with various frameworks including FISMA, HIPAA, PCI-DSS, and NIST standards. My approach integrates security best practices with regulatory requirements to create robust, compliant security programs."
    },
    {
      question: "Do you provide cybersecurity training and education?",
      answer: "Yes, through Emerging Defense Solutions, I provide advanced cybersecurity training focusing on practical, hands-on skills. Training programs cover red team methodologies, defensive techniques, leadership development, and are specifically designed for military veterans transitioning to cybersecurity careers."
    },
    {
      question: "What tactical training services does EDS offer?",
      answer: "Through the EDS Defense Division, I provide comprehensive tactical training as Chief Tactical Officer. As a certified firearms, martial arts, and personal protection specialist (armed), I provide advanced tactical training programs including firearms instruction, martial arts training, and tactical defense courses. We also offer personal protection services, leveraging my certification as an armed personal protection specialist. The division additionally provides CPR and BLS certification courses. This complements my cybersecurity expertise by addressing physical security, tactical preparedness, and emergency response training needs."
    },
    {
      question: "What is your typical engagement process?",
      answer: "My engagement process begins with a detailed scoping discussion to understand your specific needs, followed by proposal and contract execution. During the engagement, I maintain regular communication with stakeholders and provide interim updates. Each engagement concludes with a comprehensive report including findings, risk ratings, and detailed remediation recommendations."
    },
    {
      question: "Can you work remotely or do you require on-site presence?",
      answer: "I can work both remotely and on-site depending on project requirements. Many assessments can be conducted remotely, while others (particularly those involving physical security or classified systems) may require on-site presence. I'm flexible and will work with your team to determine the most effective approach."
    },
    {
      question: "How do you ensure the confidentiality of sensitive information?",
      answer: "Information security and confidentiality are paramount in my work. I maintain appropriate clearances, use secure communication channels, follow strict data handling procedures, and can work within your organization's security protocols. All engagements include comprehensive confidentiality agreements and appropriate security measures."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
          Frequently Asked Questions
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Quick answers to common questions about my services, expertise, and how I can help your organization.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white pr-4 pb-1">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-20">
                        <p className="text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/20">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Every cybersecurity challenge is unique. Let's discuss your specific needs and how my expertise can help strengthen your security posture.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <Link to={createPageUrl('Contact')}>
                Get In Touch
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}