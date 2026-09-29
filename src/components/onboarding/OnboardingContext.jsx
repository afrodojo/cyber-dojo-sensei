import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const user = await base44.auth.me();
        const completed = user?.onboarding_completed || false;
        setHasCompletedOnboarding(completed);
        setIsOnboardingOpen(!completed);
        setCurrentStep(0);
      } catch {
        // Not logged in — don't show onboarding to public visitors
        setHasCompletedOnboarding(true);
        setIsOnboardingOpen(false);
      } finally {
        setLoading(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await base44.auth.updateMe({ onboarding_completed: true });
      setHasCompletedOnboarding(true);
      setIsOnboardingOpen(false);
    } catch (error) {
      console.error('Failed to mark onboarding complete:', error);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        currentStep,
        setCurrentStep,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        skipOnboarding,
        nextStep,
        prevStep,
        loading
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}