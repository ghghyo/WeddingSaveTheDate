
import React, { useState, useEffect } from 'react';
import RSVPForm from './components/RSVPForm';
import AdminDashboard from './components/AdminDashboard';
import { RSVPData, FormData } from './types';
import { storageService } from './services/storageService';
import { sheetService } from './services/sheetService';

const accommodations = [
  {
    name: 'Hyatt Regency Princeton',
    description: 'A great full-service option for guests who want a slightly more upscale stay.',
    href: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Princeton+102+Carnegie+Center+Dr+Princeton+NJ+08540'
  },
  {
    name: 'Hyatt Place Princeton',
    description: 'A convenient, comfortable option that works well for most guests.',
    href: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Place+Princeton+3565+US+Highway+1+Princeton+NJ+08540'
  },
  {
    name: 'Hilton Garden Inn Princeton Lawrenceville',
    description: 'Another nearby option with easy access to the venue.',
    href: 'https://www.hilton.com/en/hotels/ewrplgi-hilton-garden-inn-princeton-lawrenceville/'
  },
  {
    name: 'Homewood Suites by Hilton Hamilton',
    description: 'A great choice for families or guests staying a little longer.',
    href: 'https://www.google.com/maps/search/?api=1&query=Homewood+Suites+by+Hilton+Hamilton+960+US+Highway+130+Hamilton+NJ+08690'
  }
] as const;

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Serve from Vite's base URL so it works on GitHub Pages (/WeddingSaveTheDate/).
  const ACTUAL_IMAGE_SRC = `${import.meta.env.BASE_URL}IMG_0231.jpeg`;

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

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-stone-500 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-2">The Date</p>
                <p className="text-stone-800 font-serif text-xl">May 31, 2026</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-stone-200" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-2">The Venue</p>
                <a
                  href="https://maps.app.goo.gl/AxocnyNss7NEGtnZ8?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-800 font-serif text-xl hover:text-[#556b2f] transition-colors"
                >
                  The Boathouse at Mercer Lake
                </a>
                <p className="mt-1 text-stone-500 text-sm">334 S Post RD, West Windsor Township, NJ 08550</p>
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

            <section
              id="registry"
              className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] border border-stone-200/80 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#556b2f]/[0.06] via-transparent to-stone-200/40 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#556b2f]/30 to-transparent" />
              <div className="relative px-8 py-12 md:px-14 md:py-16 text-center space-y-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Registry</p>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900">A little something, if you wish</h2>
                <div className="max-w-xl mx-auto space-y-4">
                  <p className="text-stone-600 leading-7 text-lg font-serif italic text-stone-700/90">
                    Your presence at our wedding is the greatest gift we could ask for.
                  </p>
                  <p className="text-stone-600 leading-7">
                    If you would still like to celebrate with a gift, we have put together a registry. There is absolutely no obligation, only love and good company required.
                  </p>
                </div>
                <div className="flex justify-center pt-2">
                  <a
                    href="https://www.myregistry.com/giftlist/hajerandyoussef"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#556b2f] px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-md shadow-[#556b2f]/20 transition-all hover:bg-[#3d4d21] hover:shadow-lg hover:shadow-[#556b2f]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#556b2f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfcf9]"
                  >
                    View our registry
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H9M17 7v8" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <section className="max-w-5xl mx-auto bg-white border border-stone-100 rounded-[2rem] shadow-sm p-8 md:p-12 space-y-8">
              <div className="max-w-3xl space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Accommodations</p>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Nearby places to stay</h2>
                <p className="text-stone-600 leading-7">
                  For guests traveling in, here are a few nearby hotel options close to{' '}
                  <a
                    href="https://maps.app.goo.gl/AxocnyNss7NEGtnZ8?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#556b2f] hover:text-[#3d4d21] transition-colors"
                  >
                    The Boathouse at Mercer Lake
                  </a>
                  . We recommend booking early, as availability may change closer to the wedding date.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {accommodations.map((hotel) => (
                  <a
                    key={hotel.name}
                    href={hotel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-[1.5rem] border border-stone-200 bg-stone-50/60 p-6 transition-all hover:-translate-y-0.5 hover:border-[#556b2f]/40 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <h3 className="text-xl font-serif text-stone-900 group-hover:text-[#556b2f] transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-stone-600 leading-7">{hotel.description}</p>
                      </div>
                      <span className="mt-1 text-[#556b2f] transition-transform group-hover:translate-x-0.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 17L17 7M17 7H9M17 7v8" />
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
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
