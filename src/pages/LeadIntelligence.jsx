import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Zap, CheckCircle, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import HelpTooltip from '../components/onboarding/HelpTooltip';
import { InfoBanner } from '../components/onboarding/ContextualHelp';

export default function LeadIntelligence() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState([]);
  const [scores, setScores] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsList, scoresList, suggestionsList] = await Promise.all([
        base44.entities.Lead.list('-created_date', 50),
        base44.entities.LeadScore.list('-overall_score', 100),
        base44.entities.AIFollowUpSuggestion.filter({ status: 'pending' }, '-created_date', 100)
      ]);

      setLeads(leadsList);

      // Map scores by lead_id
      const scoresMap = {};
      scoresList.forEach(score => {
        scoresMap[score.lead_id] = score;
      });
      setScores(scoresMap);

      // Map suggestions by lead_id
      const suggestionsMap = {};
      suggestionsList.forEach(suggestion => {
        if (!suggestionsMap[suggestion.lead_id]) {
          suggestionsMap[suggestion.lead_id] = [];
        }
        suggestionsMap[suggestion.lead_id].push(suggestion);
      });
      setSuggestions(suggestionsMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreLead = async (leadId) => {
    try {
      await base44.functions.invoke('calculateLeadScore', { leadId });
      await loadData();
      alert('Lead scored successfully');
    } catch (error) {
      alert('Failed to score lead: ' + error.message);
    }
  };

  const handleGenerateAISuggestions = async (leadId) => {
    setGeneratingAI(true);
    try {
      await base44.functions.invoke('generateAIFollowUpSuggestions', { leadId });
      await loadData();
      alert('AI suggestions generated');
    } catch (error) {
      alert('Failed to generate suggestions: ' + error.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return 'bg-green-500/10 border-green-500/30';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-400">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white">Lead Intelligence</h1>
                <HelpTooltip
                  content="Automatically score leads based on engagement, briefing outcomes, and company fit. Use AI suggestions to personalize follow-ups for each prospect."
                  title="Lead Intelligence"
                  position="right"
                />
              </div>
              <p className="text-slate-400">AI-powered lead scoring and follow-up suggestions</p>
            </div>
          </div>
          <InfoBanner
            title="Getting Started"
            description="Score a lead to calculate engagement, briefing, and fit scores. Then generate AI suggestions for personalized follow-up actions."
            variant="tip"
          />
        </motion.div>

        {/* Leads Grid */}
        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No leads found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead, idx) => {
              const score = scores[lead.id];
              const leadSuggestions = suggestions[lead.id] || [];

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{lead.name}</h3>
                      <p className="text-sm text-slate-400">{lead.company}</p>
                    </div>
                    {score && (
                      <div className={`text-2xl font-bold ${getScoreColor(score.overall_score)}`}>
                        {score.overall_score}
                      </div>
                    )}
                  </div>

                  {score && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Engagement</span>
                        <span className="text-cyan-400">{score.engagement_score}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-cyan-400 h-1.5 rounded-full"
                          style={{ width: `${score.engagement_score}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs mt-3">
                        <span className="text-slate-400">Briefing Fit</span>
                        <span className="text-purple-400">{score.briefing_score}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-purple-400 h-1.5 rounded-full"
                          style={{ width: `${score.briefing_score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {leadSuggestions.length > 0 && (
                    <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-xs text-blue-400 font-medium">{leadSuggestions.length} AI suggestions</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScoreLead(lead.id);
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs flex-1"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Score Lead
                      </Button>
                      <HelpTooltip
                        content="Calculates a lead score (0-100) based on email engagement, briefing outcomes, and company fit."
                        position="bottom"
                        size="sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateAISuggestions(lead.id);
                        }}
                        disabled={generatingAI}
                        size="sm"
                        variant="outline"
                        className="text-xs flex-1"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {generatingAI ? 'Generating...' : 'Get AI Ideas'}
                      </Button>
                      <HelpTooltip
                        content="AI analyzes lead data and history to suggest personalized email templates, call strategies, and content recommendations."
                        position="bottom"
                        size="sm"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Selected Lead Details */}
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedLead.name}</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Company</p>
                <p className="text-white font-medium">{selectedLead.company}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Title</p>
                <p className="text-white font-medium">{selectedLead.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Email</p>
                <p className="text-white font-medium text-sm">{selectedLead.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Status</p>
                <p className="text-white font-medium capitalize">{selectedLead.status}</p>
              </div>
            </div>

            {/* AI Suggestions */}
            {suggestions[selectedLead.id] && suggestions[selectedLead.id].length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">AI Follow-up Suggestions</h3>
                  <HelpTooltip
                    content="These are AI-generated suggestions tailored to this lead's profile and interaction history. Review, copy, and modify as needed before using."
                    title="AI Suggestions"
                    position="right"
                  />
                </div>
                <div className="space-y-3">
                  {suggestions[selectedLead.id].map((suggestion, idx) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">{suggestion.suggestion_title}</p>
                          <p className="text-xs text-slate-400 capitalize">{suggestion.suggestion_type.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {suggestion.confidence}% confident
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => {
                              navigator.clipboard.writeText(suggestion.suggestion_content);
                              alert('Copied to clipboard');
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{suggestion.suggestion_content}</p>
                      <p className="text-xs text-slate-500 italic">Why: {suggestion.reasoning}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}