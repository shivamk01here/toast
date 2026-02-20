"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import PersonaSelector from "@/components/PersonaSelector";
import RoastInput from "@/components/RoastInput";
import FullScreenRoast from "@/components/FullScreenRoast";
import FeedbackModal from "@/components/FeedbackModal";
import WaitlistModal from "@/components/WaitlistModal";

import { PERSONA_MAP } from "@/lib/personas";
import { PersonaKey, RoastResultData, RoastMode } from "@/types/roast";
import { HEADER_SUBTITLES } from "@/lib/quotes";
import { getUserCountry } from "@/lib/location";

export default function Home() {
  const [persona, setPersona] = useState<PersonaKey | null>(null);
  const [mode, setMode] = useState<RoastMode>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RoastResultData | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [headerSubtitle, setHeaderSubtitle] = useState(HEADER_SUBTITLES[0]);

  const [victimCount, setVictimCount] = useState(2500);

  // Analytics: Session ID (random string stored in memory for this session)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [roastsRemaining, setRoastsRemaining] = useState<number | null>(null);

  useEffect(() => {
    // 1. Randomize header subtitle
    setHeaderSubtitle(HEADER_SUBTITLES[Math.floor(Math.random() * HEADER_SUBTITLES.length)]);

    // 2. Check location
    getUserCountry().then((country) => {
      if (country === 'IN') {
        setPersona('ashneer');
      }
    });

    // Check rate limit status on page load
    fetch(`/api/roast?t=${Date.now()}`).then(r => r.json()).then(data => {
      setRoastsRemaining(data.remaining ?? 3);
      if ((data.remaining ?? 3) === 0) setRateLimitReached(true);
    }).catch(() => {});

    // 3. Analytics: Page View with Country
    getUserCountry().then((country) => {
      fetch('/api/analytics', {
         method: 'POST',
         body: JSON.stringify({ type: 'page_view', data: { sessionId, country: country || 'Unknown' } })
      }).catch(err => console.error("Analytics Error", err));
    });

    // 4. Analytics: Heartbeat (every 15s)
    const heartbeat = setInterval(() => {
       fetch('/api/analytics', {
         method: 'POST',
         body: JSON.stringify({ type: 'heartbeat', data: { sessionId } })
       }).catch(err => console.error("Heartbeat Error", err));
    }, 15000);

    // 5. Fetch total victims (page views + offset)
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        const views = data.analytics?.events?.filter((e: any) => e.type === 'page_view').length || 0;
        setVictimCount(2500 + views);
      })
      .catch(err => console.error("Failed to fetch stats", err));

    // 6. Listen for waitlist trigger from components
    const handleOpenWaitlist = () => setShowWaitlist(true);
    document.addEventListener('openWaitlist', handleOpenWaitlist);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('openWaitlist', handleOpenWaitlist);
    };
  }, [sessionId]); // sessionId is stable but needed for ESLint


  // Default to wolf for logic if nothing selected, but UI will show empty
  const selectedPersona = persona ? PERSONA_MAP[persona] : PERSONA_MAP.wolf;

  const roastEmail = async () => {
    if (!email.trim() || email.length < 5) {
      setError("Type something first!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowFullScreen(true); // Open the full screen experience immediately

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          persona: persona ?? "wolf",
          mode 
        })
      });

      const payload = await response.json();
      if (response.status === 429) {
        setRateLimitReached(true);
        setRoastsRemaining(0);
        setShowWaitlist(true);
        throw new Error("RATE_LIMIT_EXCEEDED");
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Roast failed.");
      }

      // Simulate a little delay if the API is too fast, so the loading animation has time to shine
      // But don't make it too long if the API took time.
      // For now, let's just let the natural API delay happen, plus a minimum visual delay handled by the user experience?
      // Actually, let's just wait a fixed amount to ensure they see the funny quotes.
      await new Promise(resolve => setTimeout(resolve, 8000)); 

      setResult(payload as RoastResultData);

      if (payload.remaining !== undefined) {
        setRoastsRemaining(payload.remaining);
      } else {
        setRoastsRemaining(prev => prev !== null ? Math.max(0, prev - 1) : null);
      }

      // Analytics: Roast Complete
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({ 
          type: 'roast_complete', 
          data: { 
            sessionId, 
            persona: persona ?? "wolf",
            mode 
          } 
        })
      }).catch(err => console.error("Analytics Error", err));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected roast engine failure.";
      if (message !== "RATE_LIMIT_EXCEEDED") {
        setError(message);
      }
      setShowFullScreen(false); // Close if error
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center overflow-x-hidden p-2 md:p-4 pb-20">
      
      {/* HEADER */}
      <header className="w-full max-w-[95%] lg:max-w-6xl flex justify-between items-end mb-4 md:mb-8 mt-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 md:gap-4">
             <Image
              src="/icon.png"
              alt="PitchSlap"
              width={160}
              height={160}
              className="w-20 h-20 md:w-32 md:h-32 object-contain -ml-2 shrink-0"
            />
            <h1 className="font-heading text-[8vw] leading-[0.8] md:text-7xl font-extrabold uppercase tracking-tighter">
              Pitch<span className="text-red-600">Slap</span>
            </h1>
          </div>
          <p className="font-sans text-xs md:text-sm font-black bg-[#FFDE59] inline-block px-3 py-1 border-2 border-black mt-1 self-start ml-2 shadow-[2px_2px_0_0_black]">
            {headerSubtitle}
          </p>
        </div>
        <div className="hidden md:block text-right self-start mt-4">
          <div className="neo-box px-4 py-2 bg-[#5CE1E6] text-xs font-bold border-2 border-black shadow-[4px_4px_0_0_#000]">
            VICTIMS: <span id="counter">{victimCount.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* WHAT IS PITCHSLAP? */}
      <section className="w-full max-w-[95%] lg:max-w-6xl mb-8">
        <div className="neo-box bg-[#FF66C4] p-6 border-2 border-black shadow-[4px_4px_0_0_#000]">
          <h2 className="font-heading text-2xl md:text-3xl font-black uppercase mb-4">
            What is PitchSlap?
          </h2>
          <div className="font-simple font-bold text-sm md:text-base space-y-4 leading-relaxed">

            <div className="space-y-4">
              <p>
              You paste that <span className="bg-white px-1">&quot;hope this finds you well&quot;</span> garbage you&apos;re about to send.
              </p>
              <p>
              We take your boring draft, ruthlessly roast the desperation out of it, and hand you back a version that actually converts.
              </p>
              <p>
              You send the fixed version and actually get a reply.
              </p>
            </div>
            <p className="border-t-2 border-black pt-4 mt-4 uppercase tracking-wider">
              Consider it aggressive consulting for people who prefer making money over sounding polite.
            </p>
          </div>
        </div>
      </section>


      {/* COMPACT CONTENT CONTAINER */}
      <div className="w-full max-w-[95%] lg:max-w-6xl flex flex-col gap-6">
        
        {/* 1. CHARACTER SELECTOR (Full Width) */}
        <div className="w-full">
          <PersonaSelector selected={persona} onChange={setPersona} />
        </div>

        {/* 2. INPUT AREA (Full Width, Centered) */}
        <div className="w-full shadow-[8px_8px_0_0_#000] border-2 border-black bg-white">
          {roastsRemaining !== null && !rateLimitReached && (
            <div className="px-4 pt-2 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
              🔥 {roastsRemaining} free roast{roastsRemaining !== 1 ? 's' : ''} remaining today
            </div>

          )}
          <RoastInput
            value={email}
            mode={mode}
            disabled={loading}
            selectedPersona={selectedPersona}
            onChange={setEmail}
            onModeChange={setMode}
            onRoast={roastEmail}
            rateLimitReached={rateLimitReached}
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="neo-box bg-[#FF66C4] px-4 py-3 text-sm font-bold text-black border-2 border-black shadow-[4px_4px_0_0_#000] text-center uppercase tracking-wider animate-shake">
            ⚠️ {error}
          </div>
        )}

      </div>

      {/* DEVELOPER FOOTER */}
      <footer className="mt-12 text-center pb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#FF66C4]">
           CONTACT DEV FOR ANY COLLABORATION 😇 O:) : <a href="mailto:pitchx26@gmail.com" className="underline hover:text-black decoration-2">pitchx26@gmail.com</a>
        </p>
      </footer>

      {/* FEEDBACK MODAL & FAB */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
      
      {!showFullScreen && (
        <button
          onClick={() => {
            console.log("FAB Clicked");
            setShowFeedback(true);
          }}
          className="fixed bottom-6 right-6 z-[999] bg-white border-4 border-black w-14 h-14 rounded-full flex items-center justify-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform active:translate-y-0"
        >
          <span className="text-2xl">📣</span>
        </button>
      )}

      {/* WAITLIST MODAL */}
      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />

      {/* FULL SCREEN EXPERIENCE */}

      <FullScreenRoast
        isOpen={showFullScreen}
        loading={loading}
        persona={selectedPersona}
        result={result}
        onClose={() => setShowFullScreen(false)}
      />

    </main>
  );
}
