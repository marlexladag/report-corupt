import React, { useState } from 'react';
import { signInWithGoogle } from '../services/authService';

const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

interface HomeProps {
    onShowPublicReports: () => void;
}

export const Home: React.FC<HomeProps> = ({ onShowPublicReports }) => {
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            console.error("Login failed:", err);
            setError("Failed to sign in. Please try again.");
        }
    };

    return (
        <div className="text-center py-12">
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 mb-8">
                Your voice matters. Securely report ghost projects, substandard infrastructure, and corrupt officials to help build a more transparent and accountable society.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={handleLogin} className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                    <GoogleIcon className="w-5 h-5 mr-3" />
                    Sign In to File a Report
                </button>
                <button onClick={onShowPublicReports} className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-6 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                    View Public Reports
                </button>
            </div>
            {error && <p className="mt-6 text-red-500">{error}</p>}
        </div>
    );
};