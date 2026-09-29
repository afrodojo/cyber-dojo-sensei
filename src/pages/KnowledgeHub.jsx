import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, BarChart2, BookMarked, Mic, Newspaper, Rss, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PillarLayout from "@/components/pillars/PillarLayout";

const features = [
  {
    icon: BarChart2,
    title: "Blog",
    description: "In-depth articles on red teaming, threat intelligence, security architecture, and cybersecurity leadership.",
    to: "Blog",
    cta: "Read Articles"
  },
  {
    icon: ShieldCheck,
    title: "Cyber Bulletins",
    description: "Curated threat intelligence and security alerts to keep you informed about the latest vulnerabilities.",
    to: "CyberBulletins",
    cta: "View Bulletins"
  },
  {
    icon: BookMarked,
    title: "Books & Publications",
    description: "Authored books, research papers, and published works on cybersecurity topics.",
    to: "Publications",
    cta: "Browse Books"
  },
  {
    icon: Mic,
    title: "Webinars",
    description: "Educational webinars covering practical cybersecurity skills, career advice, and industry trends.",
    to: "Webinars",
    cta: "Watch Webinars"
  },
  {
    icon: Rss,
    title: "Industry Feed",
    description: "Aggregated cybersecurity news and articles from across the industry, all in one place.",
    to: "IndustryFeed",
    cta: "Browse Feed"
  },
  {
    icon: Newspaper,
    title: "Resources",
    description: "Free resources, tools, and downloadable materials to support your cybersecurity learning journey.",
    to: "Resources",
    cta: "Get Resources"
  }
];

export default function KnowledgeHub() {
  return (
    <PillarLayout
      icon={BookOpen}
      title="Knowledge Hub"
      tagline="Learn Cyber Basics & Beyond"
      description="Free articles, bulletins, books, webinars, and resources for anyone looking to learn cybersecurity — from beginners just starting out to experienced professionals staying current."
      accent="amber"
      seoTitle="Knowledge Hub | Cybersecurity Learning Resources"
      seoDescription="Blog articles, cyber bulletins, books, webinars, industry feeds, and free resources for cybersecurity learning."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-amber-500/40 transition-colors"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
            <Link to={createPageUrl(feature.to)} onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-1 text-amber-400 text-sm font-medium hover:gap-2 transition-all">
              {feature.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </PillarLayout>
  );
}