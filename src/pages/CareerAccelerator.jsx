import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Rocket, BookOpen, Award, Users, BarChart3, Mic, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import PillarLayout from "@/components/pillars/PillarLayout";
import PhDSenseiCard from "@/components/PhDSenseiCard";

const features = [
  {
    icon: BookOpen,
    title: "Training Catalog",
    description: "Browse our full catalog of cybersecurity courses — from beginner fundamentals to advanced certifications.",
    to: "TrainingCatalog",
    cta: "Browse Courses"
  },
  {
    icon: Award,
    title: "PhD Grants Hub",
    description: "Discover funding opportunities for doctoral research in cybersecurity, defense, and STEM fields.",
    to: "PhDGrantsHub",
    cta: "Find Funding"
  },
  {
    icon: Users,
    title: "Workshops",
    description: "Hands-on workshops to build practical skills in penetration testing, red teaming, and security analysis.",
    to: "WorkshopBooking",
    cta: "Book a Workshop"
  },
  {
    icon: BarChart3,
    title: "Capability Matrix",
    description: "Map your skill progression and identify the competencies needed to advance your cybersecurity career.",
    to: "CapabilityMatrix",
    cta: "View Matrix"
  },
  {
    icon: Mic,
    title: "Webinars",
    description: "On-demand and live webinars covering industry trends, technical deep dives, and career strategies.",
    to: "Webinars",
    cta: "Watch Webinars"
  },
  {
    icon: Shield,
    title: "Sentinel Simulator",
    description: "Interactive security scenarios to practice your skills in a safe, guided environment.",
    to: "SentinelSimulator",
    cta: "Try Simulator"
  }
];

export default function CareerAccelerator() {
  return (
    <PillarLayout
      icon={Rocket}
      title="Career Accelerator"
      tagline="Advance Your Cyber Career"
      description="Training, certifications, funding, and resources for career seekers, cybersecurity professionals, and peers looking to level up their skills and advance in the industry."
      accent="emerald"
      seoTitle="Career Accelerator | Cybersecurity Career Training & Resources"
      seoDescription="Training catalog, PhD grants, workshops, webinars, and career resources for cybersecurity professionals."
    >
      <PhDSenseiCard accent="emerald" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/40 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
            <Link to={createPageUrl(feature.to)} onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium hover:gap-2 transition-all">
              {feature.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </PillarLayout>
  );
}