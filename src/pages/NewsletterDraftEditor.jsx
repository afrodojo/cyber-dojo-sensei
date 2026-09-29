import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function NewsletterDraftEditor() {
  const [focusTopics, setFocusTopics] = useState('emerging threats, threat intelligence, defense strategies');
  const [generating, setGenerating] = useState(false);
  const [newsletter, setNewsletter] = useState(null);
  const [copied, setCopied] = useState(false);
  const { isAdmin } = useAdminAccess();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await base44.functions.invoke('generateNewsletter', {
        focus_topics: focusTopics
      });
      setNewsletter(result);
    } catch (error) {
      console.error('Failed to generate newsletter:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(newsletter.newsletter.full_html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatWithAgent = async () => {
    const conversation = await base44.agents.createConversation({
      agent_name: 'newsletter_writer',
      metadata: { name: 'Newsletter Writing', description: 'Write cybersecurity newsletters' }
    });
    window.location.href = `/CyberNewsletterWriter?conv_id=${conversation.id}`;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">Newsletter generation is restricted to administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Mail className="w-10 h-10 text-cyan-400" />
            Newsletter Draft Editor
          </h1>
          <p className="text-slate-400">AI-powered newsletter writing based on current threat intelligence and industry news</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Newsletter Focus (comma-separated topics)
            </label>
            <textarea
              value={focusTopics}
              onChange={(e) => setFocusTopics(e.target.value)}
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
              placeholder="e.g., emerging threats, compliance updates, red team tactics..."
            />
            <p className="text-xs text-slate-400 mt-2">
              Specify what you'd like the newsletter to focus on. The agent will research current news and create relevant content.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={generating} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              {generating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><Mail className="w-4 h-4 mr-2" />Generate Newsletter</>
              )}
            </Button>
            <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800">
              <Link to={createPageUrl('AgentChatPage?agent=newsletter_writer')}>Chat with Agent</Link>
            </Button>
          </div>
        </motion.div>

        {newsletter && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Newsletter Preview</h2>
                <Button onClick={handleCopyContent} variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                  {copied ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" />Copy HTML</>
                  )}
                </Button>
              </div>
              <div className="space-y-4 text-white">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-1">Subject Line</p>
                  <p className="text-lg font-semibold text-cyan-300">{newsletter.newsletter.subject_line}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Opening Hook</p>
                  <p className="text-slate-200">{newsletter.newsletter.opening_hook}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Key Insights</p>
                  <ul className="space-y-2 text-slate-200">
                    {newsletter.newsletter.key_insights.map((insight, idx) => (
                      <li key={idx} className="flex gap-3"><span className="text-cyan-400">•</span><span>{insight}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Threat Updates</p>
                  <p className="text-slate-200 whitespace-pre-wrap">{newsletter.newsletter.threat_summary}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Recommended Resources</p>
                  <ul className="space-y-2 text-slate-200">
                    {newsletter.newsletter.resource_recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3"><span className="text-cyan-400">→</span><span>{rec}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Call to Action</p>
                  <p className="text-slate-200 italic">{newsletter.newsletter.call_to_action}</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-white mb-3">Content Sources Used</p>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>Threat Intelligence: {newsletter.sources_used.threat_intel_count} recent alerts</p>
                  <p>Blog Posts: {newsletter.sources_used.recent_posts} recent posts</p>
                  <p>Case Studies: {newsletter.sources_used.case_studies} relevant studies</p>
                  <p>Webinars: {newsletter.sources_used.upcoming_webinars} upcoming</p>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-white mb-3">Next Steps</p>
                <p className="text-sm text-slate-300">{newsletter.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}