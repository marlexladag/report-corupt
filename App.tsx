import React, { useState } from 'react';
import { Header } from './components/Header';
import { CorruptionReportForm } from './components/CorruptionReportForm';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { UserReportsView } from './components/UserReportsView';
import { PublicReportsView } from './components/PublicReportsView';
import { saveReport } from './services/reportService';
import { useAuth } from './context/AuthContext';
import { Home } from './components/Home';
import type { FormData, ReportWithId } from './types';

type View = 'main' | 'privacy' | 'admin' | 'userReports' | 'public';

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [view, setView] = useState<View>('main');

  const handleFormSubmit = async (formData: FormData, file: File | null) => {
    setIsLoading(true);
    setError(null);
    setIsSubmitted(false);

    if (!currentUser) {
      setError('You must be logged in to submit a report.');
      setIsLoading(false);
      return;
    }

    try {
      // The file is not being used for now, but we keep it in the signature
      // for potential future use (e.g., uploading to Firebase Storage).
      await saveReport({ ...formData, userId: currentUser.uid });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Report Submission Error:", err);
      setError(err.message || "An unexpected error occurred while submitting your report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setError(null);
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    setView('main');
  };
  
  const renderContent = () => {
    if (view === 'privacy') {
        return <PrivacyPolicy onBack={() => setView('main')} />;
    }
    
    if (view === 'userReports') {
        return <UserReportsView onBack={() => setView('main')} />;
    }

    if (view === 'public') {
        return <PublicReportsView onBack={() => setView('main')} />;
    }

    if (view === 'admin') {
        return <AdminView onBack={() => setView('main')} />;
    }
    
    if (!currentUser) {
        return <Home onShowPublicReports={() => setView('public')} />;
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Submitting your report securely...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
            <p className="text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg">{error}</p>
            <button
                onClick={handleReset}
                className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
                Try Again
            </button>
        </div>
      );
    }
    
    if (isSubmitted) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Report Submitted Successfully</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Thank you for your contribution. Your report has been securely recorded.
                </p>
                <button
                    onClick={handleReset}
                    className="mt-8 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                >
                    File Another Report
                </button>
            </div>
        );
    }

    return (
        <>
          {!isSubmitted && !isLoading && (
            <>
              <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-100 mb-2">
                Report Corruption
              </h2>
              <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                Your report helps build a transparent and accountable society.
              </p>
            </>
          )}
          <CorruptionReportForm onSubmit={handleFormSubmit} />
        </>
    );
  };


  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
      <Header onShowAdmin={() => setView('admin')} onShowUserReports={() => setView('userReports')} onGoHome={() => setView('main')} onShowPublicReports={() => setView('public')} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8 w-full">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 sm:p-8">
            {renderContent()}
        </div>
      </main>
      <Footer onShowPrivacy={() => setView('privacy')} />
    </div>
  );
};

export default App;