import React, { useState } from "react";
import { ChevronDown, ExternalLink, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playSlash } from "@/lib/ninjaSounds";

export default function GrantCard({ grant, isDeadlineSoon }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    playSlash();
    setExpanded(!expanded);
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(grant.amount);

  const deadlineDate = new Date(grant.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="shuriken-clip bg-ninja-surface border-2 border-primary overflow-hidden"
    >
      <div className="p-6 cursor-pointer hover:bg-card/50 transition-colors" onClick={handleExpand}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-primary">{grant.title}</h3>
              {isDeadlineSoon && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500 rounded-sm animate-pulse">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold text-red-400">URGENT</span>
                </div>
              )}
            </div>
            <p className="text-foreground/70 text-sm mb-3">{grant.provider}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-foreground/50 text-xs font-medium uppercase">Funding Amount</p>
                <p className="text-primary font-bold text-lg">{formattedAmount}</p>
              </div>
              <div>
                <p className="text-foreground/50 text-xs font-medium uppercase">Deadline</p>
                <p className={`font-bold text-base ${daysLeft < 0 ? 'text-red-400' : daysLeft < 30 ? 'text-orange-400' : 'text-primary'}`}>
                  {daysLeft < 0 ? '⏱ Closed' : `${daysLeft}d left`}
                </p>
              </div>
            </div>

            <p className="text-foreground/60 text-sm line-clamp-2">{grant.description}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExpand();
            }}
            className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-md transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={`w-6 h-6 text-primary transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-primary/30 overflow-hidden"
          >
            <div className="p-6 bg-card/30 space-y-4">
              {grant.description && (
                <div>
                  <h4 className="font-semibold text-primary mb-2 text-sm uppercase">About This Grant</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">{grant.description}</p>
                </div>
              )}

              {grant.eligibility && grant.eligibility.length > 0 && (
                <div>
                  <h4 className="font-semibold text-primary mb-2 text-sm uppercase">Eligibility</h4>
                  <ul className="space-y-1">
                    {grant.eligibility.map((item, idx) => (
                      <li key={idx} className="text-foreground/70 text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-primary/20">
                <a
                  href={grant.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-background font-semibold rounded-md transition-all ninja-glow"
                >
                  Apply / View Official Source
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}