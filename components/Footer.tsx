import React from 'react';

interface FooterProps {
    onShowPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowPrivacy }) => {
  return (
    <footer className="bg-white dark:bg-slate-800 shadow-inner mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} CorruptionWatch. All Rights Reserved.</p>
        <div className="mt-1 space-x-4">
            <span>Your identity is kept anonymous. Report with confidence.</span>
            <button onClick={onShowPrivacy} className="underline hover:text-red-500">
                Privacy Policy
            </button>
        </div>
      </div>
    </footer>
  );
};