import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const SectorContext = createContext(null);

const SECTOR_KEY = "user_sector";

export const SECTOR_LABELS = {
  business: "Business",
  career: "Career Seeker",
  education: "Education",
  general: "Knowledge",
};

/**
 * SectorProvider manages the active audience sector (business / career / education)
 * and persists it to localStorage so it survives page reloads and tabs.
 */
export function SectorProvider({ children }) {
  const [sector, setSectorState] = useState(() => {
    try {
      return localStorage.getItem(SECTOR_KEY) || null;
    } catch {
      return null;
    }
  });

  const setSector = useCallback((newSector) => {
    setSectorState(newSector);
    try {
      if (newSector) {
        localStorage.setItem(SECTOR_KEY, newSector);
      } else {
        localStorage.removeItem(SECTOR_KEY);
      }
    } catch {}
    // Dispatch for same-tab listeners (storage event only fires cross-tab)
    window.dispatchEvent(new Event("sector-change"));
  }, []);

  // Sync across tabs / windows
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === SECTOR_KEY) {
        setSectorState(e.newValue || null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <SectorContext.Provider value={{ sector, setSector, labels: SECTOR_LABELS }}>
      {children}
    </SectorContext.Provider>
  );
}

export function useSector() {
  const ctx = useContext(SectorContext);
  if (!ctx) {
    return { sector: null, setSector: () => {}, labels: SECTOR_LABELS };
  }
  return ctx;
}