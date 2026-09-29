import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GraduationCap, Handshake, BookOpen, Users, BarChart3, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PillarLayout from "@/components/pillars/PillarLayout";
import PhDSenseiCard from "@/components/PhDSenseiCard";

const features = [
  {
    icon: Handshake,
    title: "Partnerships",
    description: "Collaborate with us on curriculum development, research projects, and cybersecurity program building.",
    to: "Partners",
    cta: "Become a Partner"
  },
  {
    icon: BookOpen,
    title: "Training Catalog",
    description: "Programs and courses designed for academic institutions — from foundational courses to advanced certifications.",
    to: "TrainingCatalog",
    cta: "Browse Programs"
  },
  {
    icon: Users,
    title: "Workshops",
    description: "On-site and virtual workshops tailored for students, faculty, and institutional cybersecurity programs.",
    to: "WorkshopBooking",
    cta: "Book a Workshop"
  },
  {
    icon: BarChart3,
    title: "Capability Matrix",
    description: "A comprehensive framework mapping cybersecurity competencies for curriculum alignment and accreditation.",
    to: "CapabilityMatrix",
    cta: "View Matrix"
  },
  {
    icon: GraduationCap,
    title: "PhD Grants Hub",
    description: "Research funding opportunities for doctoral candidates in cybersecurity, defense, and related STEM fields.",
    to: "PhDGrantsHub",
    cta: "Explore Grants"
  },
  {
    icon: Building2,
    title: "Capability Statement",
    description: "Review our organizational capabilities, past performance, and qualifications for institutional collaboration.",
    to: "CapabilityStatement",
    cta: "View Statement"
  }
];

export default function InstitutionalPartnerships() {
  return (
    <PillarLayout
      icon={GraduationCap}
      title="Institutional Partnerships"
      tagline="Empower Your Institution"
      description="Partner with us to build world-class cybersecurity programs — curriculum development, training delivery, research collaboration, and funding opportunities for colleges and universities."
      accent="purple"
      seoTitle="Institutional Partnerships | Educational Cybersecurity Collaboration"
      seoDescription="Partnerships, curriculum development, training programs, and research collaboration for educational institutions."
    >
      <PhDSenseiCard accent="purple" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-purple-500/40 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
            <Link to={createPageUrl(feature.to)} onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-1 text-purple-400 text-sm font-medium hover:gap-2 transition-all">
              {feature.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </PillarLayout>
  );
}