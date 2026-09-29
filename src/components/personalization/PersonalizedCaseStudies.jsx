import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";

export default function PersonalizedCaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        let sessionId = localStorage.getItem('user_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('user_session_id', sessionId);
        }

        const result = await base44.functions.invoke('personalizeContent', {
          session_id: sessionId,
          page_context: { current_page: 'Portfolio', time_spent: 0 }
        });

        if (result?.recommendations?.featured_case_studies) {
          setCaseStudies(result.recommendations.featured_case_studies);
        } else {
          const allCases = await base44.entities.CaseStudy.list('-created_date', 3);
          setCaseStudies(allCases || []);
        }
      } catch (error) {
        console.error('Failed to load case studies:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {Array(2).fill(0).map((_, idx) => (
          <div key={idx} className="h-48 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-4"
    >
      {caseStudies.map((study, idx) => (
        <motion.div
          key={study.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800 hover:to-slate-900 border border-slate-700/50 hover:border-slate-700 rounded-lg p-6 transition-all"
        >
          <Link to={createPageUrl(`CaseStudyDetail?id=${study.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              {study.personalization_score > 0.3 && (
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
              {study.title}
            </h3>
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{study.challenge}</p>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              {study.vulnerabilities_found && (
                <div className="bg-slate-900/50 rounded p-2">
                  <p className="text-slate-400">Vulnerabilities</p>
                  <p className="text-cyan-400 font-semibold">{study.vulnerabilities_found}</p>
                </div>
              )}
              {study.risk_reduction && (
                <div className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <div>
                    <p className="text-slate-400">Risk Reduction</p>
                    <p className="text-green-400 font-semibold">{study.risk_reduction}</p>
                  </div>
                </div>
              )}
            </div>

            <span className="text-xs font-semibold text-slate-400 capitalize">
              {study.category}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}