import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingContext';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Lead Intelligence',
    description: 'A comprehensive platform for managing leads, scoring prospects, and automating follow-ups powered by AI.',
    icon: '🚀',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          You're about to transform your lead management with advanced CRM integration, intelligent lead scoring, and AI-powered suggestions.
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span> Sync leads from HubSpot or Salesforce
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span> Automatically score leads based on engagement
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span> Get AI-powered follow-up suggestions
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'crm_setup',
    title: 'Setting Up CRM Connection',
    description: 'Connect your CRM system to automatically sync leads and engagement data.',
    icon: '🔗',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          The system supports both HubSpot and Salesforce. To get started:
        </p>
        <ol className="space-y-3 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="text-cyan-400 font-semibold">1.</span>
            <span>Go to <span className="text-cyan-400 font-medium">Admin Settings</span> → <span className="text-cyan-400 font-medium">CRM Integration</span></span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-semibold">2.</span>
            <span>Select your CRM platform (HubSpot or Salesforce)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-semibold">3.</span>
            <span>Click <span className="text-cyan-400 font-medium">"Connect"</span> and authorize the connection</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-semibold">4.</span>
            <span>Configure field mapping to align your CRM fields with our system</span>
          </li>
        </ol>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-sm text-cyan-300">
          💡 Once connected, leads will be automatically pulled daily and synced bidirectionally.
        </div>
      </div>
    )
  },
  {
    id: 'lead_scoring',
    title: 'Understanding Lead Scoring',
    description: 'Learn how the system intelligently scores and prioritizes your leads.',
    icon: '📊',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          Each lead receives a score from 0-100 based on three key factors:
        </p>
        <div className="space-y-3">
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3">
            <p className="font-semibold text-cyan-400 mb-1">Engagement Score (35%)</p>
            <p className="text-sm text-slate-400">Email opens, clicks, and replies</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-3">
            <p className="font-semibold text-purple-400 mb-1">Briefing Score (40%)</p>
            <p className="text-sm text-slate-400">Executive briefing outcomes and completions</p>
          </div>
          <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-3">
            <p className="font-semibold text-amber-400 mb-1">Fit Score (25%)</p>
            <p className="text-sm text-slate-400">Budget range and project timeline alignment</p>
          </div>
        </div>
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-300">
          💡 Scores update automatically when lead data or interactions change.
        </div>
      </div>
    )
  },
  {
    id: 'ai_suggestions',
    title: 'AI-Powered Follow-up Suggestions',
    description: 'Leverage AI to get personalized next steps for each lead.',
    icon: '🤖',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          The AI analyzes each lead's profile and interaction history to suggest:
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 text-lg">📧</span>
            <div>
              <p className="font-semibold">Email Templates</p>
              <p className="text-slate-400 text-xs">Personalized email drafts tailored to each lead</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 text-lg">📞</span>
            <div>
              <p className="font-semibold">Call Strategy</p>
              <p className="text-slate-400 text-xs">Suggested talking points and best times to reach out</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 text-lg">📚</span>
            <div>
              <p className="font-semibold">Content Recommendations</p>
              <p className="text-slate-400 text-xs">Resources most relevant to their industry and interests</p>
            </div>
          </li>
        </ul>
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-300">
          💡 Suggestions are generated automatically and can be accepted, modified, or rejected.
        </div>
      </div>
    )
  },
  {
    id: 'dashboard',
    title: 'Your Lead Intelligence Dashboard',
    description: "Where you'll manage all your leads and see actionable insights.",
    icon: '📈',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          Access <span className="text-cyan-400 font-medium">Lead Intelligence</span> to:
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span> View all leads ranked by score
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span> Click any lead to see detailed scoring breakdown
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span> Review and implement AI suggestions
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span> Manually score leads or refresh scores
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span> Track sync status and engagement metrics
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Ready to transform your lead management.',
    icon: '✨',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          You now have everything you need to manage leads intelligently.
        </p>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Connect your CRM</p>
              <p className="text-slate-400 text-xs">Access CRM Integration page from admin menu</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Score your first leads</p>
              <p className="text-slate-400 text-xs">Visit Lead Intelligence dashboard to score leads</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Explore AI suggestions</p>
              <p className="text-slate-400 text-xs">Let AI help you craft personalized follow-ups</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Need help? Hover over question marks (?) throughout the app for contextual tips.
        </p>
      </div>
    )
  }
];

export default function OnboardingFlow() {
  const { currentStep, nextStep, prevStep, completeOnboarding, skipOnboarding, isOnboardingOpen } = useOnboarding();

  if (!isOnboardingOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-2">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </p>
              <div className="w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <button
              onClick={skipOnboarding}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{step.title}</h2>
            <p className="text-slate-400 mb-6">{step.description}</p>
            <div className="text-slate-300">{step.content}</div>
          </motion.div>

          {/* Footer */}
          <div className="border-t border-slate-700 p-6 flex items-center justify-between bg-slate-900/50">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {ONBOARDING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    idx <= currentStep ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {isLastStep ? (
              <Button
                onClick={completeOnboarding}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Setup
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}