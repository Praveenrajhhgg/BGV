
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import ReportsPage from './pages/ReportsPage';
import BillingPage from './pages/BillingPage';
import SupportPage from './pages/SupportPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { TourProvider } from './contexts/TourContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <TourProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/candidates/:id" element={<CandidateDetailPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>
          </Routes>
        </TourProvider>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;