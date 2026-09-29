import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, TrendingUp, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function SEOAnalyzer({ pagePath, pageTitle, pageDescription, pageContent, onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('seoAnalysis', {
        pageTitle,
        pageDescription,
        pageContent,
        pagePath
      });
      setAnalysis(response);
      onAnalysisComplete?.(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze SEO');
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Analyze SEO
          </>
        )}
      </Button>
    );
  }

  const seoScore = analysis.seo_score || 0;
  const scoreColor = seoScore >= 80 ? 'text-green-400' : seoScore >= 60 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = seoScore >= 80 ? 'bg-green-500/20' : seoScore >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* SEO Score */}
      <div className={`${scoreBg} border border-slate-700 rounded-lg p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">SEO Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${scoreColor}`}>{seoScore}</span>
              <span className="text-slate-400">/100</span>
            </div>
          </div>
          <TrendingUp className={`w-12 h-12 ${scoreColor}`} />
        </div>
      </div>

      {/* Suggested Title & Description */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Suggested Title
          </h4>
          <p className="text-white text-sm">{analysis.suggested_title}</p>
          <p className="text-xs text-slate-400 mt-2">{analysis.suggested_title?.length || 0} characters</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Suggested Meta Description
          </h4>
          <p className="text-white text-sm">{analysis.suggested_description}</p>
          <p className="text-xs text-slate-400 mt-2">{analysis.suggested_description?.length || 0} characters</p>
        </motion.div>
      </div>

      {/* Keywords */}
      {(analysis.primary_keywords || analysis.long_tail_keywords) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Recommended Keywords</h4>
          <div className="space-y-3">
            {analysis.primary_keywords && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Primary Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.primary_keywords.map((keyword, idx) => (
                    <span key={idx} className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.long_tail_keywords && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Long-tail Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.long_tail_keywords.map((keyword, idx) => (
                    <span key={idx} className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            Improvement Recommendations
          </h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex gap-3">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Content Gaps */}
      {analysis.content_gaps && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Content Gaps</h4>
          <ul className="space-y-2">
            {analysis.content_gaps.map((gap, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex gap-3">
                <span className="text-yellow-400 flex-shrink-0">→</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <Button onClick={handleAnalyze} variant="outline" className="w-full">
        Re-analyze
      </Button>
    </motion.div>
  );
}