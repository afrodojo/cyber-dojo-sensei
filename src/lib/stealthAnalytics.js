// Stealth Analytics — lightweight localStorage tracker for portfolio engagement
// Tracks user interactions (publication expansions, audio toggles, research lab clicks)

const STORAGE_KEY = "stealth_analytics";

function getRaw() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function trackEvent(eventName) {
  if (typeof window === "undefined") return;
  const data = getRaw();
  data[eventName] = (data[eventName] || 0) + 1;
  data.lastActivity = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAnalytics() {
  return getRaw();
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}