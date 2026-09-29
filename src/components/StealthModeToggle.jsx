import React, { useState, useEffect } from "react";
import ShurikenIcon from "@/components/icons/ShurikenIcon";
import { trackEvent } from "@/lib/stealthAnalytics";

export default function StealthModeToggle() {
  const [daylight, setDaylight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme_mode") === "daylight";
    setDaylight(stored);
    if (stored) document.documentElement.classList.add("daylight");
  }, []);

  const toggle = () => {
    const next = !daylight;
    setDaylight(next);
    if (next) {
      document.documentElement.classList.add("daylight");
      localStorage.setItem("theme_mode", "daylight");
    } else {
      document.documentElement.classList.remove("daylight");
      localStorage.setItem("theme_mode", "stealth");
    }
    trackEvent("theme_toggle");
  };

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-md transition-colors hover:bg-muted"
      aria-label={daylight ? "Switch to Stealth Mode" : "Switch to Daylight Mode"}
      title={daylight ? "Switch to Stealth Mode (Dark)" : "Switch to Daylight Mode (Light)"}
    >
      <ShurikenIcon
        className={`w-5 h-5 transition-all duration-500 ${
          daylight
            ? "text-primary opacity-50 rotate-90"
            : "text-primary shuriken-glow"
        }`}
      />
    </button>
  );
}