
import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import { RSVPData } from './types';
import { storageService } from './services/storageService';

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

  // Serve from Vite's base URL so it works on GitHub Pages (/WeddingSaveTheDate/).
  const ACTUAL_IMAGE_SRC = `${import.meta.env.BASE_URL}IMG_0231.jpeg`;
  const SCHEDULE_IMAGE_SRC = `${import.meta.env.BASE_URL}schedule.png`;

  useEffect(() => {
    setRsvps(storageService.getRSVPs());
    const handleHash = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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

            <div
              id="rsvp-section"
              className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 text-center scroll-mt-24"
            >
              <h2 className="text-4xl font-serif text-stone-800">Kindly Respond</h2>
              <p className="mt-4 text-lg text-stone-600">
                We are at capacity, looking forward to welcoming all our guests!
              </p>
            </div>

            <section className="max-w-4xl mx-auto bg-white border border-stone-100 rounded-[2rem] shadow-sm px-8 py-10 md:px-12 md:py-12 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4">Gifts</p>
              <p className="text-2xl md:text-3xl font-serif text-stone-900 leading-relaxed">
                Your presence is the greatest gift. For those who wish to give, cards are warmly appreciated.
                <span className="block mt-3 text-xl md:text-2xl text-stone-700">No boxed gifts, please.</span>
              </p>
            </section>

            <section className="max-w-5xl mx-auto space-y-6">
              <div className="text-center space-y-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Schedule</p>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Wedding Day Schedule</h2>
              </div>
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute -inset-1 bg-stone-200 rounded-[2rem] blur opacity-20"></div>
                <div className="relative overflow-hidden rounded-[1.8rem] shadow-xl bg-white ring-1 ring-stone-200/50">
                  <img
                    src={SCHEDULE_IMAGE_SRC}
                    alt="Wedding day schedule"
                    className="w-full h-auto object-contain block mx-auto"
                  />
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
