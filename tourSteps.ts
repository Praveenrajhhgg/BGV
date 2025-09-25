
import { ReactNode } from 'react';

export interface TourStep {
  target: string;
  title: string;
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  path?: string;
}

export const tourSteps: TourStep[] = [
  {
    target: 'body',
    title: 'Welcome to GetmeVerify!',
    content: 'This quick tour will guide you through the main features of your client dashboard. Let\'s get started!',
    placement: 'center',
  },
  {
    target: '#tour-step-sidebar-nav',
    title: 'Main Navigation',
    content: 'Use the sidebar to easily navigate between different sections like the Dashboard, Candidates list, Billing, and Support.',
    placement: 'right',
    path: '/dashboard',
  },
  {
    target: '#tour-step-header-search',
    title: 'Global Search',
    content: 'Quickly find any candidate by name or email using this search bar. It\'s available on every page.',
    placement: 'bottom',
  },
  {
    target: '#tour-step-theme-toggle',
    title: 'Toggle Theme',
    content: 'Prefer a darker look? Switch between light and dark modes for your viewing comfort.',
    placement: 'bottom',
  },
  {
    target: '#tour-step-user-menu',
    title: 'Your Account',
    content: 'Access your profile settings or log out from this menu.',
    placement: 'bottom',
  },
  {
    target: '#tour-step-dashboard-cards',
    title: 'Key Statistics',
    content: 'Get an at-a-glance overview of your candidate pipeline with these summary cards.',
    placement: 'bottom',
    path: '/dashboard',
  },
  {
    target: '#tour-step-add-candidate',
    title: 'Add New Candidates',
    content: 'Click here to start a new background verification process for a candidate. This is where the magic begins!',
    placement: 'bottom',
    path: '/candidates'
  },
];