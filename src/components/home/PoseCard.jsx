import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function PoseCard({ pose, index, isFocused, isDimmed, onHover, onLeave, onSelect, dissolving }) {
  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      initial={{ opacity: 0, y: 50 }}
      animate={dissolving
        ? { opacity: 0, scale: 1.15, filter: "blur(16px)" }
        : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: dissolving ? 0 : 0.3 + index * 0.15, duration: dissolving ? 0.72 : 1.2, ease: "easeOut" }}
      className="relative cursor-pointer min-w-0 h-full min-h-[220px] sm:min-h-0"
      style={{
        transform: isFocused ? "scale(1.05)" : "scale(1)",
        filter: isDimmed ? "blur(3px)" : "blur(0px)",
        opacity: isDimmed ? 0.5 : 1,
        transition: "transform 0.4s ease-in-out, filter 0.4s ease-in-out, opacity 0.4s ease-in-out",
      }}
    >
      {/* Frosted glass panel */}
      <div
        className="relative rounded-xl md:rounded-2xl overflow-hidden border h-full"
        style={{
          background: "rgba(224,224,224,0.08)",
          backdropFilter: "blur(12px)",
          borderColor: isFocused ? "rgba(0,242,255,0.8)" : "rgba(255,255,255,0.3)",
          boxShadow: isFocused
            ? "0 0 24px rgba(0,242,255,0.35), inset 0 0 32px rgba(0,242,255,0.06)"
            : "0 0 12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Character image */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={pose.image}
            alt={pose.alt}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Bottom gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-2/5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.4) 75%, transparent 100%)" }} />

          {/* Kanji */}
          <div className="absolute top-2 sm:top-3 left-0 right-0 flex justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl text-white/80 font-serif" style={{ textShadow: "0 0 10px rgba(0,242,255,0.5), 0 2px 4px rgba(0,0,0,0.9)" }}>
              {pose.kanji}
            </span>
          </div>

          {/* Floating holographic icon */}
          <div className="absolute top-10 sm:top-12 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-400/50 bg-black/50 flex items-center justify-center">
            <span className="text-cyan-300 text-[10px] sm:text-xs font-bold">{pose.iconChar}</span>
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 md:p-4 text-center" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 100%)" }}>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-cyan-300 font-bold mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95)" }}>
              {pose.label}
            </p>
            <p className="text-white text-[11px] sm:text-xs md:text-sm font-semibold leading-snug mb-2 sm:mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.95)" }}>
              {pose.sub}
            </p>
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-300"
              style={{
                background: isFocused ? "rgba(0,242,255,0.25)" : "rgba(0,242,255,0.1)",
                border: "1px solid rgba(0,242,255,0.5)",
                color: "#00F2FF",
                textShadow: "0 1px 2px rgba(0,0,0,0.9)",
              }}
            >
              {pose.cta}
              {pose.crossLink && <ExternalLink className="w-3 h-3" />}
            </div>
            {pose.crossLink && (
              <p className="mt-1.5 sm:mt-2 text-[8px] sm:text-[9px] text-amber-300 font-medium flex items-center justify-center gap-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95)" }}>
                <ExternalLink className="w-2.5 h-2.5" /> Doctoral Sensei Platform
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}