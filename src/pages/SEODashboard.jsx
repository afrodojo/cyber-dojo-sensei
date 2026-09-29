import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, TrendingUp, Target, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import SEOAnalyzer from "../components/seo/SEOAnalyzer";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const PAGES_TO_ANALYZE = [
  { name: "Home", path: "Portfolio", icon: "🏠" },
  { name: "About", path: "About", icon: "👤" },
  { name: "Services", path: "Services", icon: "💼" },
  { name: "Blog", path: "Blog", icon: "📝" },
  { name: "Contact", path: "Contact", icon: "📧" },
  { name: "Publications", path: "Publications", icon: "📚" },
  { name: "Capability Statement", path: "CapabilityStatement", icon: "📋" },
];

export default function SEODashboard() {
  const { isAdmin, loading } = useAdminAccess();
  const [selectedPage, setSelectedPage] = useState(null);
  const [analyses, setAnalyses] = useState({});
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);

  const handleAnalysisComplete = (pagePath, analysis) => {
    setAnalyses(prev => ({
      ...prev,
      [pagePath]: { ...analysis, timestamp: new Date().toISOString() }
    }));
  };

  const handleBatchAnalyze = async () => {
    setBatchAnalyzing(true);
    for (const page of PAGES_TO_ANALYZE) {
      try {
        const response = await base44.functions.invoke('seoAnalysis', {
          pageTitle: `${page.name} | Asaad Morman`,
          pageDescription: `Learn more about ${page.name.toLowerCase()}`,
          pageContent: `This is the ${page.name} page of Asaad Morman's cybersecurity portfolio.`,
          pagePath: page.path
        });
        setAnalyses(prev => ({
          ...prev,
          [page.path]: { ...response, timestamp: new Date().toISOString() }
        }));
      } catch (error) {
        console.error(`Failed to analyze ${page.name}:`, error);
      }
    }
    setBatchAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Access Denied</p>
          <p className="text-slate-400">Only admins can access the SEO Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-cyan-400" />
                SEO Dashboard
              </h1>
              <p className="text-slate-400">AI-powered analysis and optimization recommendations</p>
            </div>
            <Button
              onClick={handleBatchAnalyze}
              disabled={batchAnalyzing}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {batchAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing All...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze All Pages
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pages List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Pages</h2>
              <div className="space-y-2">
                {PAGES_TO_ANALYZE.map((page) => {
                  const analysis = analyses[page.path];
                  const hasAnalysis = !!analysis;
                  const scoreColor = analysis?.seo_score >= 80 ? 'text-green-400' : 
                                    analysis?.seo_score >= 60 ? 'text-yellow-400' : 'text-red-400';

                  return (
                    <motion.button
                      key={page.path}
                      onClick={() => setSelectedPage(page.path)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedPage === page.path
                          ? 'bg-cyan-500/20 border border-cyan-500/30'
                          : 'hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{page.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{page.name}</p>
                            {hasAnalysis && (
                              <p className={`text-xs ${scoreColor}`}>
                                Score: {analysis.seo_score}/100
                              </p>
                            )}
                          </div>
                        </div>
                        {hasAnalysis && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Analysis View */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            {selectedPage ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
                {analyses[selectedPage] ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {PAGES_TO_ANALYZE.find(p => p.path === selectedPage)?.name}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Last analyzed: {new Date(analyses[selectedPage].timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    {/* SEO Score */}
                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300 text-sm mb-1">SEO Score</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-cyan-400">
                              {analyses[selectedPage].seo_score}
                            </span>
                            <span className="text-slate-400">/100</span>
                          </div>
                        </div>
                        <Target className="w-16 h-16 text-cyan-400/30" />
                      </div>
                    </div>

                    {/* Suggested Meta */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Meta Title</h4>
                        <p className="text-white text-sm">{analyses[selectedPage].suggested_title}</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Meta Description</h4>
                        <p className="text-white text-sm">{analyses[selectedPage].suggested_description}</p>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3">Recommended Keywords</h4>
                      <div className="space-y-3">
                        {analyses[selectedPage].primary_keywords && (
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Primary</p>
                            <div className="flex flex-wrap gap-2">
                              {analyses[selectedPage].primary_keywords.map((kw, idx) => (
                                <span key={idx} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {analyses[selectedPage].long_tail_keywords && (
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Long-tail</p>
                            <div className="flex flex-wrap gap-2">
                              {analyses[selectedPage].long_tail_keywords.map((kw, idx) => (
                                <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {analyses[selectedPage].recommendations && (
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          Top Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {analyses[selectedPage].recommendations.slice(0, 5).map((rec, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex gap-3">
                              <span className="text-cyan-400">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No analysis yet</p>
                    <SEOAnalyzer
                      pagePath={selectedPage}
                      pageTitle="Page Title"
                      pageDescription="Page Description"
                      pageContent="Page content goes here..."
                      onAnalysisComplete={(analysis) => handleAnalysisComplete(selectedPage, analysis)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
                <Search className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Select a page to view SEO analysis</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}