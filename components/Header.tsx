import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../services/authService';

interface HeaderProps {
    onShowAdmin?: () => void;
    onShowUserReports?: () => void;
    onShowPublicReports?: () => void;
    onGoHome?: () => void;
    onLogout?: () => void;
}

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onShowAdmin, onShowUserReports, onShowPublicReports, onGoHome, onLogout }) => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const ADMIN_UID = 'YOUR_ADMIN_UID_HERE'; // IMPORTANT: Replace with your actual Admin UID

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={onGoHome} className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1">
          <EyeIcon className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Corruption<span className="text-red-600">Watch</span>
          </h1>
        </button>

        <nav className="flex items-center space-x-4">
            <button onClick={onShowPublicReports} className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Public Reports
            </button>
            {currentUser && (
                <button onClick={onGoHome} className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    File a Report
                </button>
            )}
            
            {currentUser?.uid === ADMIN_UID && onShowAdmin && (
                <button onClick={onShowAdmin} className="hidden sm:block text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
                    Admin Dashboard
                </button>
            )}
        </nav>

        {!currentUser ? (
            <button onClick={signInWithGoogle} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                Sign In
            </button>
        ) : (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              {currentUser.photoURL ? (
                <img className="h-10 w-10 rounded-full" src={currentUser.photoURL} alt="User" />
              ) : (
                <span className="font-bold">{currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}</span>
              )}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-700 dark:text-slate-200">Signed in as</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{currentUser.displayName || currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { onGoHome?.(); setIsMenuOpen(false); }} className="sm:hidden block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">File a Report</button>
                    <button onClick={() => { onShowPublicReports?.(); setIsMenuOpen(false); }} className="sm:hidden block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">Public Reports</button>
                    {onShowUserReports && <button onClick={() => { onShowUserReports(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">My Reports</button>}
                    {currentUser.uid === ADMIN_UID && onShowAdmin && <button onClick={() => { onShowAdmin(); setIsMenuOpen(false); }} className="sm:hidden block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">Admin Dashboard</button>}
                  </div>
                  
                  <div className="py-1 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};