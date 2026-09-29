import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Maps pillar routes to human-readable names for GA4 reporting
const PILLAR_ROUTES = {
  "/business": "Business Solutions",
  "/career": "Career Accelerator",
  "/institutions": "Institutional Partnerships",
  "/knowledge": "Knowledge Hub",
  "/research": "Research & PhD",
};

/**
 * PillarTimeTracker — pushes custom events to the GTM dataLayer so Google Analytics
 * can report which audience pillar visitors spend the most time on.
 *
 * Fires two events:
 *   - pillar_page_view  { pillar }                  — when a visitor lands on a pillar
 *   - pillar_time_spent { pillar, time_spent_seconds } — when they leave or close the tab
 *
 * In GTM, create a GA4 event tag for "pillar_time_spent" with custom parameters
 * pillar (dimension) and time_spent_seconds (metric) to surface this in GA4 reports.
 */
export default function PillarTimeTracker() {
  const location = useLocation();
  const entryTimeRef = useRef(null);
  const currentPillarRef = useRef(null);

  const flush = () => {
    if (currentPillarRef.current && entryTimeRef.current) {
      const seconds = Math.round((Date.now() - entryTimeRef.current) / 1000);
      if (seconds > 0 && typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "pillar_time_spent",
          pillar: currentPillarRef.current,
          time_spent_seconds: seconds,
        });
      }
    }
    entryTimeRef.current = null;
    currentPillarRef.current = null;
  };

  // On every route change: flush the previous pillar, then start tracking the new one
  useEffect(() => {
    flush();
    const pillar = PILLAR_ROUTES[location.pathname];
    if (pillar) {
      entryTimeRef.current = Date.now();
      currentPillarRef.current = pillar;
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({ event: "pillar_page_view", pillar });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Flush on tab close / hide so the last pillar session is captured
  useEffect(() => {
    const handleHide = () => flush();
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", handleHide);
    window.addEventListener("beforeunload", handleHide);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pagehide", handleHide);
      window.removeEventListener("beforeunload", handleHide);
      document.removeEventListener("visibilitychange", handleVisibility);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}