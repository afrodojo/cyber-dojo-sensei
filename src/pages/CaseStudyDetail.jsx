import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Target, Shield, TrendingUp, CheckCircle2, Building, Clock, Award, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/seo/SEOHead";

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

export default function CaseStudyDetail() {
  const [caseStudy, setCaseStudy] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const all = await base44.entities.CaseStudy.list();
      const current = all.find(c => c.id === id);
      setCaseStudy(current || null);
      if (current) {
        const rel = all.filter(c => c.id !== id && c.category === current.category).slice(0, 3);
        setRelated(rel);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Case Study Not Found</h1>
        <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600">
          <Link to={createPageUrl("Portfolio")}>Back to Portfolio</Link>
        </Button>
      </div>
    );
  }

  const gradient = categoryColors[caseStudy.category] || "from-cyan-500 to-blue-600";
  const label = categoryLabels[caseStudy.category] || caseStudy.category;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-6">
      <SEOHead
        title={`${caseStudy.title} | Case Study – Asaad Morman`}
        description={caseStudy.challenge}
      />
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Link to={createPageUrl("Portfolio")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`bg-gradient-to-r ${gradient} rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            {caseStudy.featured && (
              <Badge className="bg-yellow-500/90 text-yellow-900 border-0 flex items-center gap-1 w-fit mb-4">
                <Award className="w-3 h-3" /> Featured
              </Badge>
            )}
            <Badge className="bg-white/20 text-white border-0 mb-3">{label}</Badge>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{caseStudy.title}</h1>
                <p className="text-white/80 text-xl">{caseStudy.client}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        {(caseStudy.duration || caseStudy.vulnerabilities_found || caseStudy.risk_reduction || caseStudy.potential_savings) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {caseStudy.duration && (
              <Card className="bg-slate-800/50 border-slate-700/50 text-center">
                <CardContent className="p-5">
                  <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Duration</div>
                  <div className="text-xl font-bold text-white">{caseStudy.duration}</div>
                </CardContent>
              </Card>
            )}
            {caseStudy.vulnerabilities_found && (
              <Card className="bg-slate-800/50 border-slate-700/50 text-center">
                <CardContent className="p-5">
                  <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Vulnerabilities</div>
                  <div className="text-xl font-bold text-white">{caseStudy.vulnerabilities_found}</div>
                </CardContent>
              </Card>
            )}
            {caseStudy.risk_reduction && (
              <Card className="bg-slate-800/50 border-slate-700/50 text-center">
                <CardContent className="p-5">
                  <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Risk Reduction</div>
                  <div className="text-xl font-bold text-white">{caseStudy.risk_reduction}</div>
                </CardContent>
              </Card>
            )}
            {caseStudy.potential_savings && (
              <Card className="bg-slate-800/50 border-slate-700/50 text-center">
                <CardContent className="p-5">
                  <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Potential Savings</div>
                  <div className="text-xl font-bold text-white">{caseStudy.potential_savings}</div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 mb-12"
        >
          {/* Challenge */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-red-400" />
                </div>
                The Challenge
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">{caseStudy.challenge}</p>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                The Solution
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">{caseStudy.solution}</p>
            </CardContent>
          </Card>

          {/* Results */}
          {caseStudy.results && Array.isArray(caseStudy.results) && caseStudy.results.length > 0 && (
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  Key Outcomes & Results
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {caseStudy.results.map((result, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-700/30 p-4 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{result}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <Card className={`bg-gradient-to-r ${gradient} border-0`}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-3">Interested in Similar Results?</h3>
              <p className="text-white/80 mb-6">Let's discuss how we can solve your security challenges.</p>
              <Button asChild size="lg" className="bg-white text-slate-900 font-bold hover:bg-slate-100">
                <Link to={createPageUrl("Contact")}>Request a Consultation</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Case Studies */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Related Case Studies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relGradient = categoryColors[rel.category] || "from-cyan-500 to-blue-600";
                return (
                  <Link key={rel.id} to={createPageUrl(`CaseStudyDetail?id=${rel.id}`)}>
                    <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 h-full group cursor-pointer">
                      <CardContent className="p-0">
                        <div className={`bg-gradient-to-r ${relGradient} p-4 rounded-t-lg`}>
                          <Badge className="bg-white/20 text-white border-0 text-xs">
                            {categoryLabels[rel.category] || rel.category}
                          </Badge>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors leading-tight">{rel.title}</h3>
                          <p className="text-slate-400 text-sm mb-3">{rel.client}</p>
                          <p className="text-slate-400 text-sm line-clamp-2">{rel.challenge}</p>
                          <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium mt-4">
                            View Case Study <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}