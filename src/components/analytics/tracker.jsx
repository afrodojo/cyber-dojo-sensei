/**
 * Analytics tracker — stores events in the AnalyticsEvent entity.
 * Lightweight, privacy-respecting, no third-party scripts required.
 */
import { base44 } from "@/api/base44Client";

const getSessionId = () => {
  let sid = sessionStorage.getItem("_sid");
  if (!sid) { sid = Math.random().toString(36).slice(2); sessionStorage.setItem("_sid", sid); }
  return sid;
};

const getTrafficSource = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    referrer: document.referrer || "direct",
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
  };
};

const getDevice = () => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
};

let _queue = [];
let _flushing = false;

const flush = async () => {
  if (_flushing || _queue.length === 0) return;
  _flushing = true;
  const batch = [..._queue];
  _queue = [];
  try {
    for (const ev of batch) {
      await base44.entities.AnalyticsEvent.create(ev);
    }
  } catch {
    // silently fail — analytics should never break the app
  }
  _flushing = false;
};

setInterval(flush, 5000);
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}

export const track = (eventName, properties = {}) => {
  _queue.push({
    event_name: eventName,
    page: window.location.pathname + window.location.search,
    session_id: getSessionId(),
    device: getDevice(),
    ...getTrafficSource(),
    properties: JSON.stringify(properties),
    timestamp: new Date().toISOString(),
  });
};

export const trackPageView = (pageName) => track("page_view", { page_name: pageName });
export const trackClick = (label, extra = {}) => track("click", { label, ...extra });
export const trackConversion = (type, value = null) => track("conversion", { type, value });
export const trackFormSubmit = (formName, success = true) => track("form_submit", { form_name: formName, success });