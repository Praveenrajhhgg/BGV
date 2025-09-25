
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVGhD7c0xAQAgDMCwgX/feADHEnlQZRISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEpKaA2UAARlD2tAAAAAASUVORK5CYII=";

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 print:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside 
        className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-brand-primary-light dark:bg-brand-primary-dark p-4 border-r border-slate-200 dark:border-slate-700 z-40 transition-transform duration-300 ease-in-out print:hidden
                   md:relative md:translate-x-0
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <img 
            src={logoSrc} 
            alt="GetmeVerify Logo" 
            className="h-20 w-auto" 
          />
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-3xl" aria-label="Close sidebar">
             &times;
          </button>
        </div>
        <nav id="tour-step-sidebar-nav">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.href}
                  onClick={onClose} // Close sidebar on link click on mobile
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 font-medium ${
                      isActive
                        ? 'bg-brand-accent text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-slate-700 hover:text-brand-accent dark:hover:text-brand-accent'
                    }`
                  }
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 w-56">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Need Help?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Check our support page for quick answers.</p>
              <NavLink to="/support" className="mt-4 inline-block bg-brand-accent text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                  Go to Support
              </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;