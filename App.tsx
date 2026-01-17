
import React, { useState, useEffect } from 'react';
import RSVPForm from './components/RSVPForm';
import AdminDashboard from './components/AdminDashboard';
import { RSVPData, FormData } from './types';
import { storageService } from './services/storageService';
import { sheetService } from './services/sheetService';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const ACTUAL_IMAGE_SRC = "https://lh3.googleusercontent.com/d/1Tcw8IPNDS9cI3YH5zHWmcMnFEYJVGTDv";

  useEffect(() => {
    setRsvps(storageService.getRSVPs());
    const handleHash = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleRSVPSubmit = async (formData: FormData) => {
    setIsSyncing(true);
    const newRSVP: RSVPData = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toLocaleString()
    };

    // 1. Save locally for immediate dashboard update
    storageService.saveRSVP(newRSVP);
    setRsvps(prev => [...prev, newRSVP]);

    // 2. Sync to Google Sheets
    await sheetService.syncToGoogleSheet(newRSVP);

    setIsSyncing(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fdfcf9] selection:bg-stone-200">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="text-xl font-serif font-bold text-stone-800 tracking-tight">
            Youssef <span className="text-[#556b2f]">&</span> Hajer
          </div>
          {isAdmin && (
            <div className="flex gap-6">
              <a 
                href="#" 
                className="text-sm font-medium tracking-wide text-stone-400 hover:text-stone-800 transition-colors"
                onClick={() => setIsAdmin(false)}
              >
                GUEST VIEW
              </a>
              <span className="text-sm font-medium tracking-wide text-[#556b2f] border-b-2 border-[#556b2f]">
                DASHBOARD
              </span>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-24 px-4 max-w-7xl mx-auto">
        {!isAdmin ? (
          <div className="animate-fade-in space-y-16">
            <div className="relative max-w-4xl mx-auto group">
              <div className="absolute -inset-1 bg-stone-200 rounded-[2rem] blur opacity-20 transition duration-1000"></div>
              <div className="relative overflow-hidden rounded-[1.8rem] shadow-2xl bg-white ring-1 ring-stone-200/50">
                <img 
                  src={ACTUAL_IMAGE_SRC}
                  alt="Youssef and Hajer Wedding Save the Date"
                  className="w-full h-auto object-contain block mx-auto"
                />
              </div>
            </div>

            {isSubmitted ? (
              <div className="max-w-2xl mx-auto bg-white border border-stone-100 p-12 rounded-3xl text-center shadow-sm space-y-4">
                <div className="w-16 h-16 bg-stone-50 text-[#556b2f] rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif text-stone-900">We've got you!</h2>
                <p className="text-stone-600">Your RSVP has been saved and synced to our list. We can't wait to see you!</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-[#556b2f] font-medium hover:text-[#3d4d21] transition-colors"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <div id="rsvp-section" className="scroll-mt-24 relative">
                {isSyncing && (
                  <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-stone-200 border-t-[#556b2f] rounded-full animate-spin"></div>
                      <p className="text-sm font-medium text-stone-600">Saving your response...</p>
                    </div>
                  </div>
                )}
                <RSVPForm onSubmit={handleRSVPSubmit} />
              </div>
            )}
            
            <footer className="text-center py-16 space-y-8 border-t border-stone-100">
              <p className="font-cursive text-5xl text-[#556b2f]/70">Invitations to Follow</p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-stone-500">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-2">The Date</p>
                  <p className="text-stone-800 font-serif text-xl">May 31, 2026</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-stone-200" />
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-2">The Venue</p>
                  <p className="text-stone-800 font-serif text-xl">334 S Post RD, West Windsor Township, NJ 08550</p>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          <div className="animate-fade-in">
            <AdminDashboard rsvps={rsvps} />
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default App;
