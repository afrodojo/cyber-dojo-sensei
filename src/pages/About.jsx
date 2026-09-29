import React from "react";
import { motion } from "framer-motion";

import SEOHead from "../components/seo/SEOHead";
import MilitaryService from "../components/portfolio/MilitaryService";
import SkillsShowcase from "../components/portfolio/SkillsShowcase";
import ExperienceTimeline from "../components/portfolio/ExperienceTimeline";
import CertificationsGrid from "../components/portfolio/CertificationsGrid";
import TestimonialsSection from "../components/portfolio/TestimonialsSection";
import LegislativeAlertSignup from "../components/legislative/LegislativeAlertSignup";
import EducationSection from "../components/portfolio/EducationSection";

export default function About() {
  return (
    <div className="overflow-x-hidden">
      <SEOHead 
        title="About Asaad Morman | Cybersecurity Expert & Military Veteran"
        description="Learn about Asaad Morman's unique blend of military leadership, offensive cybersecurity expertise, and entrepreneurial vision dedicated to protecting critical infrastructure."
        includePersonSchema={true}
      />
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              About Asaad Morman
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              A unique blend of military leadership, offensive cybersecurity expertise, 
              and entrepreneurial vision dedicated to protecting critical infrastructure 
              and developing the next generation of security professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 bg-slate-950">
        <EducationSection />
      </section>

      {/* Military Service Section */}
      <section className="py-20 bg-slate-950">
        <MilitaryService />
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <SkillsShowcase />
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-slate-950">
        <ExperienceTimeline />
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <CertificationsGrid />
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-950">
        <TestimonialsSection />
      </section>

      {/* Legislative Alerts Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Ahead of the Law</h2>
            <p className="text-slate-400">Subscribe to weekly cybersecurity policy & 2A legislative alerts — curated by Asaad Morman.</p>
          </div>
          <LegislativeAlertSignup />
        </div>
      </section>
    </div>
  );
}