import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Rocket, GraduationCap, BookOpen, Microscope, ArrowRight } from "lucide-react";
import { useSector } from "@/hooks/useSector.jsx";
import { ROUTES } from "@/lib/routes";

const cards = [
  {
    icon: Building2,
    title: "I want to hire or train teams",
    label: "Business Solutions",
    description: "Red team operations, penetration testing, security consulting, and enterprise training programs.",
    path: ROUTES.BUSINESS,
    sector: "business",
    accent: "from-cyan-500 to-blue-600",
    glow: "group-hover:shadow-cyan-500/30"
  },
  {
    icon: Rocket,
    title: "I want to advance my cyber career",
    label: "Career Accelerator",
    description: "Training catalog, certifications, workshops, doctoral funding opportunities, and career resources.",
    path: ROUTES.CAREER,
    sector: "career",
    accent: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-500/30"
  },
  {
    icon: GraduationCap,
    title: "I represent a college or university",
    label: "Institutional Partnerships",
    description: "Partnerships, curriculum development, capability matrix, and educational program collaboration.",
    path: ROUTES.INSTITUTIONS,
    sector: "education",
    accent: "from-purple-500 to-indigo-600",
    glow: "group-hover:shadow-purple-500/30"
  },
  {
    icon: Microscope,
    title: "I'm seeking doctoral funding & research",
    label: "Research & Doctoral Hub",
    description: "Discover doctoral grants, research funding, and academic resources in cybersecurity and defense.",
    path: ROUTES.RESEARCH,
    sector: "education",
    accent: "from-indigo-500 to-blue-600",
    glow: "group-hover:shadow-indigo-500/30"
  },
  {
    icon: BookOpen,
    title: "I want to learn cyber basics",
    label: "Knowledge Hub",
    description: "Blog articles, cyber bulletins, books, webinars, industry feeds, and free resources.",
    path: ROUTES.KNOWLEDGE,
    sector: "general",
    accent: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/30"
  }
];

export default function TrafficRouter() {
  const { setSector } = useSector();

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How would you like to enter the Cyber Dojo?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose your path below to get started with content and services tailored to your goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to={card.path}
                onClick={() => {
                  if (card.sector) setSector(card.sector);
                  window.scrollTo(0, 0);
                }}
                className={`group block h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 shadow-lg ${card.glow}`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 shrink-0 bg-gradient-to-br ${card.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">{card.label}</span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
                    <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                      Enter <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}