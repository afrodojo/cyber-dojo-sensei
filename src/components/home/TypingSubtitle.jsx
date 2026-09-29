import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const FULL_TEXT = "Welcome to the Cyber Dojo. State your purpose so I may guide your path...";

export default function TypingSubtitle() {
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), 1600);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      idx.current += 1;
      setText(FULL_TEXT.slice(0, idx.current));
      if (idx.current >= FULL_TEXT.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6 }}
      className="text-cyan-100/90 text-[11px] sm:text-sm md:text-base font-medium tracking-wide text-center max-w-[92vw] sm:max-w-xl min-h-[1.5em] break-words px-1"
    >
      {text}
      <span className="terminal-cursor">▋</span>
    </motion.p>
  );
}