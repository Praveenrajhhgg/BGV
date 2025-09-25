
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tourSteps, TourStep } from '../tourSteps';

interface TourContextType {
  isTourOpen: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  startTour: () => void;
  endTour: () => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

export const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('tourCompleted');
    if (!hasCompletedTour) {
      // Use a timeout to ensure the initial page has rendered
      const timer = setTimeout(() => {
        // Start tour only when on a page inside the layout
        if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
            startTour();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const navigateToStep = useCallback((stepIndex: number) => {
    const step = tourSteps[stepIndex];
    if (step && step.path && location.pathname !== step.path) {
      navigate(step.path);
    }
    setCurrentStepIndex(stepIndex);
  }, [navigate, location.pathname]);
  
  const startTour = useCallback(() => {
    setIsTourOpen(true);
    navigateToStep(0);
  }, [navigateToStep]);

  const endTour = useCallback(() => {
    setIsTourOpen(false);
    setCurrentStepIndex(0);
    localStorage.setItem('tourCompleted', 'true');
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < tourSteps.length - 1) {
      navigateToStep(currentStepIndex + 1);
    } else {
      endTour();
    }
  }, [currentStepIndex, endTour, navigateToStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      navigateToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, navigateToStep]);

  const value = {
    isTourOpen,
    currentStepIndex,
    currentStep: isTourOpen ? tourSteps[currentStepIndex] : null,
    startTour,
    endTour,
    goToNextStep,
    goToPrevStep,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
