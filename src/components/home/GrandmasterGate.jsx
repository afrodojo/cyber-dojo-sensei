import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, BookOpen } from "lucide-react";
import { useSector } from "@/hooks/useSector.jsx";
import { ROUTES, PHD_SENSEI_URL } from "@/lib/routes";
import { playBladeClash } from "@/lib/ninjaSounds";
import PoseCard from "./PoseCard";
import TypingSubtitle from "./TypingSubtitle";

const POSES = [
  {
    kanji: "雇",
    label: "For Employers / B2B Solutions",
    sub: "Hire Elite Tech Talent",
    cta: "Enter Business",
    route: ROUTES.BUSINESS,
    sector: "business",
    image: "https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/a2fab2845_generated_image.png",
    alt: "Grandmaster presentation stance",
    iconChar: "B2B",
  },
  {
    kanji: "道",
    label: "For Career Seekers",
    sub: "Launch Your Journey",
    cta: "Enter Career Path",
    route: ROUTES.CAREER,
    sector: "career",
    image: "https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/39b77e91a_generated_image.png",
    alt: "Grandmaster combat stance",
    iconChar: "道",
  },
  {
    kanji: "学",
    label: "For Institutions: Partner & Educate",
    sub: "Build Academic Alliances",
    cta: "Enter Institutions",
    route: ROUTES.INSTITUTIONS,
    sector: "education",
    crossLink: PHD_SENSEI_URL,
    image: "https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/289b0fc8c_generated_image.png",
    alt: "Grandmaster kneeling tactical pose",
    iconChar: "U",
  },
  {
    kanji: "知",
    label: "General Knowledge",
    sub: "Explore Cyber Basics",
    cta: "Enter Knowledge",
    route: ROUTES.KNOWLEDGE,
    sector: "general",
    image: "https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/f6dcbb4f6_generated_image.png",
    alt: "Grandmaster meditative balance pose",
    iconChar: "知",
  },
];

export default function GrandmasterGate() {
  const [visible, setVisible] = useState(true);
  const [dissolving, setDissolving] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const { setSector } = useSector();
  const navigate = useNavigate();

  // Returning visitors skip the intro entirely
  useEffect(() => {
    try {
      if (localStorage.getItem("user_sector")) setVisible(false);
    } catch {}
  }, []);

  // Lock body scroll and hide site header while the gate is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("gate-active");
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("gate-active");
    };
  }, [visible]);

  const selectPose = (pose) => {
    setSector(pose.sector);
    setDissolving(true);
    try { playBladeClash(); } catch {}
    setTimeout(() => {
      document.body.style.overflow = "unset";
      navigate(pose.route);
    }, 720);
  };

  const skipAsGuest = () => {
    setDissolving(true);
    setTimeout(() => {
      document.body.style.overflow = "unset";
      setVisible(false);
    }, 720);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="grandmaster-gate-v2"
        className="flex flex-col items-center overflow-hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          zIndex: 99999,
          background: "#000000",
        }}
        initial={{ opacity: 0 }}
        animate={dissolving
          ? { opacity: 0, filter: "blur(14px)" }
          : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: dissolving ? 0.72 : 1.5, ease: "easeInOut" }}
      >
        {/* Dojo garden background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 50% 40%, #4a3522 0%, #2a1d12 50%, #000000 100%)",
        }} />
        {/* Cherry blossom glow */}
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(ellipse at 10% 90%, rgba(244,194,194,0.3) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(244,194,194,0.25) 0%, transparent 40%)",
        }} />

        {/* Torii gate structure */}
        <svg className="absolute top-0 left-0 w-full h-24 opacity-40" viewBox="0 0 800 100" preserveAspectRatio="xMidYMin slice" fill="none">
          <path d="M0 30 L800 30 M20 60 L780 60 M40 15 L760 15 M40 15 L10 60 M760 15 L790 60 M30 60 L30 100 M770 60 L770 100" stroke="#4A3522" strokeWidth="10" />
        </svg>

        {/* Smoke bomb dissolve overlay */}
        {dissolving && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(0,242,255,0.15) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)",
          }} />
        )}

        {/* Header marquee with typing subtitle — top overlay */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative z-20 w-full flex justify-center px-2 sm:px-3 md:px-4 pt-3 sm:pt-2 md:pt-4 shrink-0"
        >
          <div className="px-3 md:px-6 py-1.5 md:py-2 rounded-lg max-w-full" style={{
            background: "rgba(74,53,34,0.85)",
            border: "1px solid rgba(197,160,89,0.5)",
          }}>
            <TypingSubtitle />
          </div>
        </motion.div>

        {/* Responsive pose grid — scrolls on mobile, fills space on desktop */}
        <div
          className="relative z-10 w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-2 px-3 sm:px-2 md:px-4 py-2 pb-3 sm:py-2 overflow-y-auto sm:overflow-hidden min-h-0"
          style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
        >
          {POSES.map((pose, i) => (
            <PoseCard
              key={pose.route}
              pose={pose}
              index={i}
              isFocused={focusedIndex === i}
              isDimmed={focusedIndex !== null && focusedIndex !== i}
              onHover={() => setFocusedIndex(i)}
              onLeave={() => setFocusedIndex(null)}
              onSelect={() => selectPose(pose)}
              dissolving={dissolving}
            />
          ))}
        </div>

        {/* Footer controls — bottom overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="relative z-20 w-full flex items-center justify-center gap-4 md:gap-10 px-2 md:px-6 pb-3 sm:pb-2 md:pb-4 shrink-0"
        >
          <button
            onClick={skipAsGuest}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors group"
          >
            <span className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-slate-600 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
              <UserX className="w-4 h-4 md:w-5 md:h-5" />
            </span>
            <span className="text-[9px] md:text-xs uppercase tracking-wider font-medium text-center">View As Guest</span>
          </button>
          <a
            href={PHD_SENSEI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors group"
          >
            <span className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-slate-600 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
            </span>
            <span className="text-[9px] md:text-xs uppercase tracking-wider font-medium text-center">About Our Sensei</span>
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}