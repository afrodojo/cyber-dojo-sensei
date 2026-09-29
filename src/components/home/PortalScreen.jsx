import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, GraduationCap, ScrollText, ExternalLink } from "lucide-react";

const BADGE_ICONS = {
  EDA: ShieldCheck,
  Globe: Globe,
  Crest: GraduationCap,
  Scroll: ScrollText,
};

export default function PortalScreen({ portal, index, onSelect }) {
  const BadgeIcon = BADGE_ICONS[portal.badge] || ShieldCheck;
  // Outer screens start further out; inner screens closer to center
  const isOuter = index === 0 || index === 3;

  return (
    <motion.button
      onClick={() => onSelect(portal)}
      initial={{ opacity: 0, y: 60, x: index < 2 ? -40 : 40 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: 0.4 + index * 0.18, duration: 0.9, ease: "easeOut" }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col items-center justify-between gap-3 rounded-xl backdrop-blur-md overflow-hidden text-left ${
        isOuter ? "w-[clamp(120px,14vw,180px)] h-[clamp(260px,46vh,360px)]" : "w-[clamp(140px,16vw,200px)] h-[clamp(280px,50vh,380px)]"
      }`}
      style={{
        background: "rgba(20,22,28,0.55)",
        border: "1.5px solid rgba(255,255,255,0.85)",
        boxShadow: "0 0 18px rgba(255,255,255,0.18), inset 0 0 24px rgba(255,255,255,0.05)",
      }}
    >
      {/* Glare sweep */}
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)" }} />

      {/* Top: Kanji */}
      <div className="pt-5 flex flex-col items-center">
        <span className="text-3xl md:text-4xl text-white/90 font-serif" style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}>
          {portal.kanji}
        </span>
        <span className="mt-1 block w-8 h-px bg-white/40" />
      </div>

      {/* Middle: Labels */}
      <div className="px-3 flex flex-col items-center text-center">
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-cyan-300 font-bold">
          {portal.label}
        </span>
        <span className="mt-1.5 text-white text-xs md:text-sm font-semibold leading-snug">
          {portal.sub}
        </span>
      </div>

      {/* Bottom: Badge */}
      <div className="pb-5 flex flex-col items-center gap-1.5">
        <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center bg-black/40">
          <BadgeIcon className="w-5 h-5 text-white/90" />
        </div>
        {portal.crossLink && (
          <span className="flex items-center gap-1 text-[9px] text-amber-300/90 font-medium">
            <ExternalLink className="w-2.5 h-2.5" /> PhD Sensei
          </span>
        )}
      </div>
    </motion.button>
  );
}