import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Shield, TrendingUp, CheckCircle2, Clock, Building, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CaseStudyModal({ caseStudy, isOpen, onClose }) {
  if (!isOpen || !caseStudy) return null;

  const categoryColors = {
    "red-team": "from-red-500 to-pink-600",
    "penetration-testing": "from-orange-500 to-amber-600",
    "compliance": "from-blue-500 to-cyan-600",
    "incident-response": "from-purple-500 to-indigo-600",
    "security-architecture": "from-green-500 to-emerald-600"
  };

  const categoryLabels = {
    "red-team": "Red Team",
    "penetration-testing": "Penetration Testing",
    "compliance": "Compliance",
    "incident-response": "Incident Response",
    "security-architecture": "Security Architecture"
  };

  const gradientColor = categoryColors[caseStudy.category] || "from-cyan-500 to-blue-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientColor} p-6 md:p-8 relative`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge className="bg-white/20 text-white border-0 mb-2">
                    {categoryLabels[caseStudy.category] || caseStudy.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{caseStudy.title}</h2>
                  <p className="text-white/80 text-lg">{caseStudy.client}</p>
                </div>
              </div>
              
              {caseStudy.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500/90 text-yellow-900 border-0 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Metrics Grid */}
              {(caseStudy.duration || caseStudy.vulnerabilities_found || caseStudy.risk_reduction || caseStudy.potential_savings) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {caseStudy.duration && (
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 mb-1">Duration</div>
                      <div className="text-lg font-bold text-white">{caseStudy.duration}</div>
                    </div>
                  )}
                  {caseStudy.vulnerabilities_found && (
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <Target className="w-5 h-5 text-red-400 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 mb-1">Vulnerabilities</div>
                      <div className="text-lg font-bold text-white">{caseStudy.vulnerabilities_found}</div>
                    </div>
                  )}
                  {caseStudy.risk_reduction && (
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <Shield className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 mb-1">Risk Reduction</div>
                      <div className="text-lg font-bold text-white">{caseStudy.risk_reduction}</div>
                    </div>
                  )}
                  {caseStudy.potential_savings && (
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                      <div className="text-xs text-slate-400 mb-1">Potential Savings</div>
                      <div className="text-lg font-bold text-white">{caseStudy.potential_savings}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Challenge, Solution, Results */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    The Challenge
                  </h3>
                  <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-lg">
                    {caseStudy.challenge}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Our Solution
                  </h3>
                  <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-lg">
                    {caseStudy.solution}
                  </p>
                </div>

                {caseStudy.results && Array.isArray(caseStudy.results) && caseStudy.results.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Key Outcomes
                    </h3>
                    <div className="bg-slate-800/30 p-4 rounded-lg space-y-3">
                      {caseStudy.results.map((result, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                <p className="text-slate-400 mb-4">Interested in similar results for your organization?</p>
                <Button 
                  className={`bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white`}
                  onClick={() => window.location.href = '/Contact'}
                >
                  Request a Consultation
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}