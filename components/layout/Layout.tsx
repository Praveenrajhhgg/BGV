
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ProductTour from '../tour/ProductTour';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-primary-light dark:bg-brand-primary-dark">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-green-50 dark:bg-brand-secondary-dark p-4 sm:p-6 md:p-8 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
      <ProductTour />
    </div>
  );
};

export default Layout;