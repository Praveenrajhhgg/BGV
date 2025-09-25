
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useTour } from '../../hooks/useTour';
import { tourSteps } from '../../tourSteps';

const ProductTour: React.FC = () => {
    const { isTourOpen, currentStep, currentStepIndex, goToNextStep, goToPrevStep, endTour } = useTour();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        if (!isTourOpen || !currentStep) {
            setTargetRect(null);
            return;
        }

        const updatePosition = () => {
            const element = document.querySelector(currentStep.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                element.classList.add('tour-highlight');
            } else if(currentStep.placement === 'center') {
                setTargetRect(null); // No specific element to highlight
            } else {
                 // Element not found, maybe on another page or not rendered yet
                 // Try again after a short delay
                 const timer = setTimeout(updatePosition, 100);
                 return () => clearTimeout(timer);
            }
        };

        // Delay to allow for page transitions
        const initTimer = setTimeout(updatePosition, 50);

        return () => {
            clearTimeout(initTimer);
            document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        };

    }, [isTourOpen, currentStep]);
    
    useEffect(() => {
        if (isTourOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isTourOpen]);


    if (!isTourOpen || !currentStep) return null;

    const getPopoverStyle = (): React.CSSProperties => {
        if (!targetRect) { // Center placement
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const styles: React.CSSProperties = {};
        const offset = 12;

        switch (currentStep.placement) {
            case 'bottom':
                styles.top = `${targetRect.bottom + offset}px`;
                styles.left = `${targetRect.left + targetRect.width / 2}px`;
                styles.transform = 'translateX(-50%)';
                break;
            case 'top':
                styles.top = `${targetRect.top - offset}px`;
                styles.left = `${targetRect.left + targetRect.width / 2}px`;
                styles.transform = 'translateY(-100%) translateX(-50%)';
                break;
            case 'left':
                styles.top = `${targetRect.top + targetRect.height / 2}px`;
                styles.left = `${targetRect.left - offset}px`;
                styles.transform = 'translateY(-50%) translateX(-100%)';
                break;
            case 'right':
                styles.top = `${targetRect.top + targetRect.height / 2}px`;
                styles.left = `${targetRect.right + offset}px`;
                styles.transform = 'translateY(-50%)';
                break;
            default: // Center
                styles.top = '50%';
                styles.left = '50%';
                styles.transform = 'translate(-50%, -50%)';
                break;
        }

        return styles;
    };

    const popoverStyle = getPopoverStyle();

    return (
        <>
            <style>{`
                .tour-highlight {
                    position: relative;
                    z-index: 10001;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
                    border-radius: 6px;
                    transition: box-shadow 0.3s ease-in-out;
                }
            `}</style>
            
            <div
                style={popoverStyle}
                className="fixed z-[10002] w-80 bg-brand-primary-light dark:bg-brand-primary-dark rounded-lg shadow-2xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in"
                role="dialog"
                aria-labelledby="tour-title"
                aria-describedby="tour-content"
            >
                <h3 id="tour-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{currentStep.title}</h3>
                <div id="tour-content" className="text-sm text-slate-600 dark:text-slate-300 mb-4">{currentStep.content}</div>

                <div className="flex justify-between items-center">
                    <div className="text-xs font-medium text-slate-500">{currentStepIndex + 1} / {tourSteps.length}</div>
                    <div className="space-x-2">
                        {currentStepIndex > 0 && (
                             <button onClick={goToPrevStep} className="px-3 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 text-sm font-semibold transition-colors">Prev</button>
                        )}
                        <button onClick={goToNextStep} className="px-3 py-1.5 rounded-md bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-semibold transition-colors">
                            {currentStepIndex === tourSteps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
                 <button onClick={endTour} className="absolute top-2 right-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-2xl" aria-label="Close tour">&times;</button>
            </div>
        </>
    );
};

export default ProductTour;
