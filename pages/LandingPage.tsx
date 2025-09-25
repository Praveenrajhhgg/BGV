
import React from 'react';
import { Link } from 'react-router-dom';

// FIX: Replaced corrupted base64 logo source with a valid placeholder.
const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVGhD7c0xAQAgDMCwgX/feADHEnlQZRISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEpKaA2UAARlD2tAAAAAASUVORK5CYII=";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-brand-secondary-light dark:bg-brand-secondary-dark min-h-screen">
      {/* Header */}
      <header className="bg-brand-primary-light dark:bg-brand-primary-dark shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logoSrc} alt="GetmeVerify Logo" className="h-12 w-auto" />
          </div>
          <nav>
            <Link to="/login" className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
              Client Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-brand-primary-light dark:bg-brand-primary-dark">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
          Fast, Reliable, and Secure Background Verification
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
          Streamline your hiring process with our comprehensive verification services. Get the insights you need to build a trustworthy team.
        </p>
        <Link to="/signup" className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/50 inline-block p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Speed & Efficiency</h3>
              <p className="text-slate-600 dark:text-slate-400">Our automated processes deliver fast and accurate results, reducing your time-to-hire.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/50 inline-block p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Comprehensive Checks</h3>
              <p className="text-slate-600 dark:text-slate-400">From criminal records to employment history, we cover all the bases to ensure you have a complete picture.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/50 inline-block p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Secure & Compliant</h3>
              <p className="text-slate-600 dark:text-slate-400">We prioritize data security and compliance, ensuring both your company's and your candidates' information is safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-primary-light dark:bg-brand-primary-dark border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6 py-6 text-center text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} GetmeVerify. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;