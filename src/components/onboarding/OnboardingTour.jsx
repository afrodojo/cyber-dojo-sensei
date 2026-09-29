import React from 'react';
import { InfoBanner, StepGuide } from './ContextualHelp';

// Feature-specific help guides shown on relevant pages
export function CRMSetupGuide() {
  const steps = [
    {
      title: 'Choose Your CRM',
      description: 'Select between HubSpot or Salesforce'
    },
    {
      title: 'Authorize Connection',
      description: 'Click connect and grant necessary permissions'
    },
    {
      title: 'Map Fields',
      description: 'Align CRM fields with our lead and engagement tracking'
    },
    {
      title: 'Start Syncing',
      description: 'Leads will pull daily and metrics sync bidirectionally'
    }
  ];

  return (
    <InfoBanner
      title="🔗 Setting Up Your CRM"
      description="Complete these 4 steps to connect your CRM and start automating lead sync."
      variant="info"
    />
  );
}

export function LeadScoringExplainer() {
  return (
    <div className="space-y-4">
      <InfoBanner
        title="📊 How Lead Scoring Works"
        description="Each lead receives a score from 0-100 based on three factors: Engagement (35%), Briefing Outcome (40%), and Company Fit (25%)."
        variant="tip"
      />
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
        <div>
          <p className="font-semibold text-cyan-400 text-sm mb-1">Engagement Score</p>
          <p className="text-xs text-slate-400">Calculated from email opens, clicks, and replies</p>
        </div>
        <div className="h-px bg-slate-700" />
        <div>
          <p className="font-semibold text-purple-400 text-sm mb-1">Briefing Score</p>
          <p className="text-xs text-slate-400">Based on executive briefing status and outcomes</p>
        </div>
        <div className="h-px bg-slate-700" />
        <div>
          <p className="font-semibold text-amber-400 text-sm mb-1">Fit Score</p>
          <p className="text-xs text-slate-400">Determined by budget range and project timeline</p>
        </div>
      </div>
    </div>
  );
}

export function AISuggestionsExplainer() {
  return (
    <div className="space-y-4">
      <InfoBanner
        title="🤖 AI-Powered Suggestions"
        description="Click 'Get AI Ideas' on any lead to generate personalized follow-up recommendations based on their profile and history."
        variant="success"
      />
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-lg">📧</span>
          <div>
            <p className="font-semibold text-white">Email Templates</p>
            <p className="text-xs text-slate-400 mt-0.5">Copy and modify AI-generated emails tailored to the lead</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">📞</span>
          <div>
            <p className="font-semibold text-white">Call Strategy</p>
            <p className="text-xs text-slate-400 mt-0.5">Get talking points and best timing for outreach</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">📚</span>
          <div>
            <p className="font-semibold text-white">Content Recommendations</p>
            <p className="text-xs text-slate-400 mt-0.5">Discover which resources match their interests</p>
          </div>
        </div>
      </div>
    </div>
  );
}