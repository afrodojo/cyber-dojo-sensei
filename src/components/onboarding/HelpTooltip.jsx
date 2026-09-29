import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function HelpTooltip({ content, title, position = 'top', size = 'sm' }) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'max-w-xs text-sm',
    md: 'max-w-sm text-base',
    lg: 'max-w-md text-base'
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        className="text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center justify-center w-5 h-5"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[position]} z-50 ${sizeClasses[size]} bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3`}
          >
            {title && <p className="font-semibold text-white mb-1">{title}</p>}
            <p className="text-slate-300 leading-relaxed">{content}</p>
            <div className="absolute w-2 h-2 bg-slate-800 border-l border-t border-slate-700 rotate-45 -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}