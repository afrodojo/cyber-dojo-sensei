import React, { createContext, useContext, useState, useEffect } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
    return localStorage.getItem("onboarding_completed") === "true";
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed") === "true";
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingCompleted,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
