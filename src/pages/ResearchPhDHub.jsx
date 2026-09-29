import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Microscope,
  Award,
  BookMarked,
  Calendar,
  DollarSign,
  ExternalLink,
  ArrowRight,
  FlaskConical,
  GraduationCap,
  TrendingUp,
  Mail,
  Bell,
  HandHeart
} from "lucide-react";
import PillarLayout from "@/components/pillars/PillarLayout";
import { Button } from "@/components/ui/button";

export default function ResearchPhDHub() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrants = async () => {
      try {
        const data = await base44.entities.PhDGrant.filter(
          { is_active: true },
          "-deadline",
          6
        );
        setGrants(data || []);
      } catch (err) {
        console.error("Failed to load grants:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGrants();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return "Varies";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const stats = [
    { icon: Award, label: "Active Grants", value: grants.length || "—", color: "text-indigo-400" },
    { icon: DollarSign, label: "Total Funding", value: grants.reduce((sum, g) => sum + (g.amount || 0), 0) > 0 ? formatCurrency(grants.reduce((sum, g) => sum + (g.amount || 0), 0)) : "—", color: "text-emerald-400" },
    { icon: FlaskConical, label: "Research Areas", value: "Cyber, Defense, STEM", color: "text-cyan-400" },
    { icon: TrendingUp, label: "Discovery", value: "Daily AI Agent", color: "text-amber-400" }
  ];

  const resources = [
    {
      icon: Award,
      title: "Browse All PhD Grants",
      description: "Explore our complete database of active PhD funding opportunities, updated daily by our autonomous AI discovery agent.",
      to: "PhDGrantsHub",
      cta: "View All Grants"
    },
    {
      icon: GraduationCap,
      title: "Training & Certification",
      description: "Build the skills and credentials that strengthen your PhD application and research capabilities.",
      to: "TrainingCatalog",
      cta: "Browse Courses"
    },
    {
      icon: BookMarked,
      title: "Research Blog",
      description: "Read insights on cybersecurity research, defense technology, and academic career pathways.",
      to: "Blog",
      cta: "Read Articles"
    },
    {
      icon: Microscope,
      title: "Industry Intelligence",
      description: "Stay current with the latest developments in cybersecurity research and defense innovation.",
      to: "IndustryFeed",
      cta: "Browse Feed"
    }
  ];

  return (
    <PillarLayout
      icon={Microscope}
      title="Research & PhD Hub"
      tagline="Fund Your Research Journey"
      description="Your centralized portal for PhD funding opportunities, research resources, and academic career advancement in cybersecurity, defense, and STEM fields. Powered by an autonomous AI agent that discovers new grants daily."
      accent="indigo"
      seoTitle="Research & PhD Hub | Funding Opportunities & Academic Resources"
      seoDescription="Discover PhD grants, research funding, and academic career resources in cybersecurity, defense, and STEM fields."
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Featured Grants */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Funding Opportunities</h2>
            <p className="text-slate-400 text-sm mt-1">Latest grants discovered by our AI agent</p>
          </div>
          <Button asChild variant="outline" className="border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 hidden sm:flex">
            <Link to={createPageUrl("PhDGrantsHub")} onClick={() => window.scrollTo(0, 0)}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : grants.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No active grants at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {grants.map((grant, idx) => (
              <motion.div
                key={grant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1 leading-tight">{grant.title}</h3>
                    <p className="text-xs text-slate-400">{grant.provider}</p>
                  </div>
                  {grant.category && (
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      {grant.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(grant.amount)}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(grant.deadline)}
                  </span>
                </div>
                {grant.application_url && (
                  <a
                    href={grant.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 text-sm font-medium hover:gap-2 transition-all"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="sm:hidden mt-4">
          <Button asChild variant="outline" className="w-full border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10">
            <Link to={createPageUrl("PhDGrantsHub")} onClick={() => window.scrollTo(0, 0)}>
              View All Grants <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Research Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <resource.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{resource.description}</p>
                  <Link to={createPageUrl(resource.to)} onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-1 text-indigo-400 text-sm font-medium hover:gap-2 transition-all">
                    {resource.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sponsor Research Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 bg-gradient-to-br from-cyan-900/20 to-indigo-900/20 border border-cyan-500/20 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HandHeart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Sponsor My Research</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Advancing the science of autonomous defense, AI security, and critical infrastructure protection.
          Your sponsorship directly accelerates open, mission-critical cybersecurity research.
        </p>
        <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-semibold">
          <Link to="/research-funding" onClick={() => window.scrollTo(0, 0)}>
            <DollarSign className="w-4 h-4 mr-2" />
            Support the Research
          </Link>
        </Button>
      </motion.div>

      {/* AI Discovery Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Automated Grant Discovery</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Our autonomous AI agent scans daily for new PhD funding opportunities across cybersecurity,
          defense, and STEM. Get notified when new grants matching your interests are discovered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold">
            <Link to={createPageUrl("PhDGrantsHub")} onClick={() => window.scrollTo(0, 0)}>
              <Award className="w-4 h-4 mr-2" />
              Explore All Grants
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10">
            <Link to={createPageUrl("Contact")} onClick={() => window.scrollTo(0, 0)}>
              <Mail className="w-4 h-4 mr-2" />
              Get Notified
            </Link>
          </Button>
        </div>
      </motion.div>
    </PillarLayout>
  );
}