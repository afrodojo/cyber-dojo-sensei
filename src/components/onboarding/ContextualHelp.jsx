import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export function InfoBanner({ title, description, icon, variant = 'info' }) {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    success: 'bg-green-500/10 border-green-500/30 text-green-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    tip: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
  };

  const icons = {
    info: '💡',
    success: '✓',
    warning: '⚠️',
    tip: '✨'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 flex items-start gap-3 ${variants[variant]}`}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{icon || icons[variant]}</span>
      <div className="flex-grow">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </motion.div>
  );
}

export function StepGuide({ steps, currentStep }) {
  return (
    <div className="space-y-3">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
            idx === currentStep
              ? 'bg-cyan-500/20 border border-cyan-500/50'
              : idx < currentStep
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-slate-900/50 border border-slate-700/30'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 ${
              idx < currentStep
                ? 'bg-green-500 text-white'
                : idx === currentStep
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {idx < currentStep ? '✓' : idx + 1}
          </div>
          <div className="flex-grow">
            <p className="font-medium text-white text-sm">{step.title}</p>
            {step.description && <p className="text-xs text-slate-400 mt-1">{step.description}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}