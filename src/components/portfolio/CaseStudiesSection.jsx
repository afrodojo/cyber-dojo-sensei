import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CaseStudy } from "@/entities/CaseStudy";
import { Shield, Target, Lock, TrendingUp, CheckCircle2, Building, Clock, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CaseStudiesSection() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [caseStudies, setCaseStudies] = useState([]);
  
  useEffect(() => {
    const fetchCaseStudies = async () => {
        try {
            const all = await CaseStudy.list('-created_date');
            // Show only featured + published studies; fallback to all published if none featured
            const published = all.filter(s => s.published !== false);
            const featured = published.filter(s => s.featured);
            setCaseStudies(featured.length > 0 ? featured : published);
        } catch (error) {
            console.error("Error fetching case studies:", error);
            setCaseStudies([]);
        }
    };
    fetchCaseStudies();
  }, []);

  if (caseStudies.length === 0) {
    return (
        <div className="max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Case Studies & Success Stories
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-8" />
                 <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    Real-world security challenges solved through advanced offensive cybersecurity expertise, delivering measurable results for enterprise clients.
                </p>
            </motion.div>
             <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Proven Client Impact</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Authentic case studies are being prepared and will be available here shortly.
                </p>
            </div>
        </div>
    );
  }
  
  const activeCase = caseStudies[activeCaseIndex];
  // The 'metrics' object is no longer explicitly parsed here, as per the outline,
  // metric properties are now expected directly on the activeCase object.
  
  const getIconForCase = (index) => {
    const icons = [Building, Shield, Lock];
    return icons[index % icons.length];
  }

  const getColorForCase = (index) => {
    const colors = ["from-blue-500 to-cyan-600", "from-red-500 to-pink-600", "from-green-500 to-emerald-600"];
    return colors[index % colors.length];
  }


  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Case Studies & Success Stories
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Real-world security challenges solved through advanced offensive cybersecurity expertise, delivering measurable results for enterprise clients.
        </p>
      </motion.div>

      {/* Case Study Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {caseStudies.map((caseStudy, index) => {
          const IconComponent = getIconForCase(index);
          const color = getColorForCase(index);
          return (
            <motion.button
              key={caseStudy.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCaseIndex(index)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                activeCaseIndex === index
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <IconComponent className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{caseStudy.client}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Case Study */}
      {activeCase && (
        <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-0">
                {/* Header */}
                <div className={`bg-gradient-to-r ${getColorForCase(activeCaseIndex)} p-8`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    {React.createElement(getIconForCase(activeCaseIndex), { className: "w-8 h-8 text-white" })}
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-white pb-2">{activeCase.title}</h3>
                    <p className="text-white/80">{activeCase.client}</p>
                    </div>
                </div>
                </div>

                {/* Content */}
                <div className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Challenge & Solution */}
                    <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-400" />
                        Challenge
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                        {activeCase.challenge}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Solution
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                        {activeCase.solution}
                        </p>
                    </div>

                    {activeCase.results && Array.isArray(activeCase.results) && (
                    <div>
                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Results
                        </h4>
                        <div className="space-y-2">
                        {activeCase.results.map((result, index) => (
                            <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{result}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                    </div>

                    {/* Metrics */}
                    {(activeCase.duration || activeCase.vulnerabilities_found || activeCase.risk_reduction || activeCase.potential_savings) && (
                    <div>
                    <h4 className="text-xl font-bold text-white mb-4">Project Metrics</h4>
                    <div className="space-y-4">
                        {activeCase.duration && (
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-400 text-sm">Duration</span>
                        </div>
                        <div className="text-xl font-bold text-cyan-400">
                            {activeCase.duration}
                        </div>
                        </div>
                        )}

                        {activeCase.vulnerabilities_found && (
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-red-400" />
                            <span className="text-slate-400 text-sm">Vulnerabilities Found</span>
                        </div>
                        <div className="text-xl font-bold text-red-400">
                            {activeCase.vulnerabilities_found}
                        </div>
                        </div>
                        )}
                        
                        {activeCase.risk_reduction && (
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-slate-400 text-sm">Risk Reduction</span>
                        </div>
                        <div className="text-xl font-bold text-green-400">
                            {activeCase.risk_reduction}
                        </div>
                        </div>
                        )}

                        {activeCase.potential_savings && (
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                            <span className="text-slate-400 text-sm">Potential Savings</span>
                        </div>
                        <div className="text-xl font-bold text-yellow-400">
                            {activeCase.potential_savings}
                        </div>
                        </div>
                        )}
                    </div>
                    </div>
                    )}
                </div>
                </div>
                {/* View Full Case Study Button */}
                <div className="px-8 pb-8">
                  <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold">
                    <Link to={createPageUrl(`CaseStudyDetail?id=${activeCase.id}`)}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Case Study
                    </Link>
                  </Button>
                </div>
            </CardContent>
            </Card>
        </motion.div>
      )}
    </div>
  );
}