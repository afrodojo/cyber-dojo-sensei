import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import SEOHead from "../components/seo/SEOHead";
import CaseStudiesSection from "../components/portfolio/CaseStudiesSection";
import ROICalculator from "../components/portfolio/ROICalculator";
import Pricing from "../components/portfolio/Pricing";
import LiveChatWidget from "../components/chat/LiveChatWidget";

export default function Services() {
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      const allCaseStudies = await base44.entities.CaseStudy.list('-created_date');
      setCaseStudies(allCaseStudies);
    }
    fetchCaseStudies();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <SEOHead 
        title="Cybersecurity Services | Penetration Testing & Red Team Operations"
        description="Elite offensive security services including penetration testing, red team operations, and security consulting for government and enterprise clients."
        includeOrgSchema={true}
      />
      <LiveChatWidget pageName="Services" />
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Cybersecurity Services
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Providing elite offensive security services to identify, assess, and mitigate complex cyber threats for government and enterprise clients.
            </p>
          </motion.div>
        </div>
      </section>

      <Pricing />

      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <CaseStudiesSection caseStudies={caseStudies} />
      </section>

      <section className="py-20 bg-slate-950">
        <ROICalculator />
      </section>
    </div>
  );
}