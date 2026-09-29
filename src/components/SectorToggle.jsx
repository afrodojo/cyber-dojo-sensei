import React, { useState, useRef, useEffect } from "react";
import { useSector, SECTOR_LABELS } from "@/hooks/useSector.jsx";
import { Building2, Rocket, GraduationCap, BookOpen, LayoutGrid, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTOR_ICONS = {
  business: Building2,
  career: Rocket,
  education: GraduationCap,
  general: BookOpen,
};

const options = [
  { value: null, label: "All Content", icon: LayoutGrid },
  { value: "business", label: "Business", icon: Building2 },
  { value: "career", label: "Career Seeker", icon: Rocket },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "general", label: "Knowledge", icon: BookOpen },
];

export default function SectorToggle() {
  const { sector, setSector } = useSector();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLabel = sector ? SECTOR_LABELS[sector] : "All Content";
  const CurrentIcon = sector ? SECTOR_ICONS[sector] : LayoutGrid;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-ninja-green hover:bg-slate-800 transition-colors border border-slate-700/50"
      >
        <CurrentIcon className="w-3.5 h-3.5" />
        <span className="hidden xl:inline">
          Viewing as: <span className="text-ninja-green font-semibold">{currentLabel}</span>
        </span>
        <span className="xl:hidden">{currentLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 w-48 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => { setSector(opt.value); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${
                  sector === opt.value
                    ? "bg-ninja-green/10 text-ninja-green font-medium"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}