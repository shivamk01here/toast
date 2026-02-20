"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Copy, Check, Share2, MessageCircle } from "lucide-react";
import Image from "next/image";
// @ts-ignore
import { toPng } from "html-to-image";
import { PersonaConfig } from "@/lib/personas";
import { RoastResultData } from "@/types/roast";
import { LOADING_MESSAGES } from "@/lib/quotes";
import CringeMeter from "./CringeMeter";
import FeedbackModal from "./FeedbackModal";

interface FullScreenRoastProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  persona: PersonaConfig | null;
  result: RoastResultData | null;
}

type TicketStyle = "default" | "jail" | "parking" | "receipt";

export default function FullScreenRoast({
  isOpen,
  onClose,
  loading,
  persona,
  result,
}: FullScreenRoastProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const roastCardRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ticketStyle, setTicketStyle] = useState<TicketStyle>("default");
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showFakeDoor, setShowFakeDoor] = useState(false);
  const [emailWaitlist, setEmailWaitlist] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (result && isOpen) {
      const styles: TicketStyle[] = ["default", "jail", "parking", "receipt"];
      setTicketStyle(styles[Math.floor(Math.random() * styles.length)]);
    }
  }, [result, isOpen]);

  useEffect(() => {
    if (loading && persona) {
      setCurrentMessage(persona.loadingMessage || LOADING_MESSAGES[0]);
      const interval = setInterval(() => {
        setCurrentMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading, persona]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.fix);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  const generateImage = async () => {
    if (!roastCardRef.current) return null;
    try {
      await document.fonts.ready;
      return await toPng(roastCardRef.current, { cacheBust: true, pixelRatio: 2 });
    } catch (err) {
      console.error("Image gen failed:", err);
      return null;
    }
  };



  const handleDownload = async () => {
    setIsDownloading(true);
    const dataUrl = await generateImage();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = `pitchslap-roast-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
    setIsDownloading(false);
  };

  const handleShareClick = async () => {
    setIsDownloading(true);
    const dataUrl = await generateImage();
    if (dataUrl) {
      setPreviewImage(dataUrl);
      setShowSharePreview(true);
    }
    setIsDownloading(false);
  };



  const getStyles = () => {
    switch (ticketStyle) {
      case "jail":
        return {
          bg: "bg-[#FF914D]",
          border: "border-black",
          text: "text-black",
          headerBg: "bg-black",
          headerText: "text-white",
          font: "font-mono",
          label: "DEPT. OF CORRECTIONS",
        };
      case "parking":
        return {
          bg: "bg-white",
          border: "border-red-600",
          text: "text-red-900",
          headerBg: "bg-red-600",
          headerText: "text-white",
          font: "font-sans",
          label: persona?.statusLabel || "ROAST CITATION",
        };
      case "receipt":
        return {
          bg: "bg-white",
          border: "border-gray-300",
          text: "text-gray-800",
          headerBg: "bg-gray-100",
          headerText: "text-gray-800",
          font: "font-mono",
          label: persona?.statusLabel || "TRANSACTION FAILED",
        };
      default:
        return {
          bg: "bg-[#fffdf5]",
          border: "border-black",
          text: "text-black",
          headerBg: "bg-black",
          headerText: "text-white",
          font: "font-mono",
          label: `CITATION #${Math.floor(Math.random() * 9999 + 1000)}`,
        };
    }
  };

  const st = getStyles();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 overflow-y-auto overflow-x-hidden"
      >

        {/* TOP BAR MOUNTED ON MOBILE */}
        {!loading && result && (
            <div className="lg:hidden sticky top-0 z-[60] w-full bg-black p-2 flex justify-between items-center border-b-2 border-white/20">
               <button
                  onClick={handleCopy}
                  className="flex-1 mr-2 py-3 bg-[#FFDE59] text-black font-black uppercase text-xs tracking-wider border-2 border-white flex justify-center items-center gap-2 shadow-[2px_2px_0_0_#fff] active:translate-y-[1px] active:shadow-none"
               >
                 {isCopying ? <Check size={16} /> : <Copy size={16} />}
                 {isCopying ? "COPIED TO DASHBOARD" : "COPY FIXED VERSION"}
               </button>
               <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white transition-colors border-2 border-transparent"
              >
                <X size={24} />
              </button>
            </div>
        )}

        {/* CLOSE BTN */}
        {/* CLOSE BTN DESKTOP */}
        {!loading && (
          <button
            onClick={onClose}
            className="hidden lg:flex fixed top-4 right-4 z-[60] w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={22} />
          </button>
        )}


        {/* ── LOADING ──────────────────────────────────── */}
        {loading && persona && (
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative w-48 h-48 rounded-full border-4 border-[#FFDE59] overflow-hidden shadow-[0_0_50px_rgba(255,222,89,0.4)]"
            >
              <Image src={persona.roastGif} alt="Loading" fill className="object-cover" unoptimized />
            </motion.div>
            <div className="space-y-4 max-w-xl">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="text-xl md:text-3xl font-black text-[#FFDE59] uppercase leading-tight"
                >
                  {currentMessage}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center gap-2">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-3 h-3 bg-[#5CE1E6] rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT ──────────────────────────────────── */}
        {!loading && result && persona && (
          <div className="min-h-screen flex items-start justify-center py-4 lg:py-12 px-4 lg:px-4 pb-20">

            {/* Outer wrapper — side by side on lg, stacked on mobile */}
            {/* Outer wrapper — side by side on lg, STACKED on mobile (Roast -> Cringe -> Actions) */}
            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start">



              {/* ── LEFT: TICKET CARD ── */}
              <div className="flex-1 min-w-0 flex flex-col items-center gap-4">
                <div
                  ref={roastCardRef}
                  className={`w-full md:w-auto max-w-[calc(100vw-2.5rem)] md:max-w-2xl ${st.bg} ${st.text} font-marker tracking-wide border-4 ${st.border} shadow-[6px_6px_0_0_rgba(0,0,0,0.8)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] mx-auto`}


                >
                  {/* Ticket header */}
                  <div className={`${st.headerBg} ${st.headerText} p-4 flex items-center gap-4`}>
                    {/* Avatar */}
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={persona.roastGif}
                        alt={persona.name}
                        fill
                        className="object-cover rounded border-2 border-white/30"
                        unoptimized
                      />
                      <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[9px] font-black px-1 py-0.5 rotate-[-12deg] border border-white/50 whitespace-nowrap">
                        {persona.statusLabel || "FAIL"}
                      </div>
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="font-black uppercase text-base md:text-xl leading-tight truncate">
                        {st.label}
                      </div>
                      <div className="text-[11px] opacity-70 uppercase mt-0.5">
                        {persona.name} &bull; {new Date().toLocaleDateString()}
                      </div>
                    </div>

                    {/* Score pill */}
                    <div className="shrink-0 flex flex-col items-center bg-red-600 text-white px-3 py-2 border-2 border-white/30 shadow-md">
                      <span className="font-black text-3xl leading-none">🗑️ {100 - result.score}</span>
                      <span className="text-[9px] font-bold uppercase opacity-80">trash score</span>
                    </div>
                  </div>

                  {/* Body - always white bg */}
                  <div className="p-5 flex flex-col gap-5 bg-white text-black">
                    {/* Roast — direct, no label, character voice */}
                    <div className="border-l-4 border-red-500 pl-4">
                      <p className="text-xl md:text-2xl font-marker leading-relaxed">
                        &ldquo;{result.roast}&rdquo;
                      </p>

                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">
                        — {persona.name}
                      </p>
                    </div>

                    <div className="border-t-2 border-dashed border-current/20" />

                    {/* Tip — character voiced callout */}
                    {result.tip && (
                      <div className="bg-black/5 border border-current/20 rounded px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">💡 The real problem</p>
                        <p className="text-base font-marker leading-relaxed">{result.tip}</p>

                      </div>
                    )}

                    <div className="border-t-2 border-dashed border-current/20" />

                    {/* Fix — full professional rewrite */}
                    <div className="relative">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">
                        ✅ Fixed Version
                      </span>
                      <button
                        onClick={handleCopy}
                        className="absolute top-0 right-0 flex items-center gap-1 text-[11px] font-black uppercase bg-[#FFDE59] text-red-600 border-2 border-black px-2 py-1 hover:bg-yellow-300 transition-colors rounded shadow-[2px_2px_0_0_#000]"
                      >
                        {isCopying ? <Check size={11} /> : <Copy size={11} />}
                        {isCopying ? "Copied!" : "Copy"}
                      </button>
                      <p className="text-sm font-simple leading-relaxed whitespace-pre-wrap pr-16 text-gray-800">
                        {result.fix}
                      </p>

                    </div>

                    {/* Fake door banner */}
                    <button
                      onClick={() => setShowFakeDoor(true)}
                      className="w-full py-3 bg-[#FFDE59] text-red-600 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000] hover:bg-yellow-300 transition-all active:translate-y-[2px] active:shadow-none animate-bounce mt-2"
                    >
                      😩 Tired of copy-pasting? Get the Chrome Extension →
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-dashed border-current/20 px-5 py-3 flex flex-col sm:flex-row justify-between gap-1 opacity-60 text-[10px] uppercase font-bold bg-white">
                    <span>Made with 😭 by a dev who sends bad emails.</span>
                    <a 
                      href="https://pitchslap.netlify.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      pitchslap.netlify.app
                    </a>
                  </div>

                </div>

                {/* Under-card link */}
                <button
                  onClick={() => setShowFeedback(true)}
                  className="text-white/50 hover:text-white text-xs font-bold uppercase underline underline-offset-4 transition-colors"
                >
                  Missing your fav character? Request them here.
                </button>
              </div>

              {/* ── RIGHT: ACTIONS PANEL ── */}
              <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3 lg:sticky lg:top-12">

                {/* Cringe Meter Panel */}
                {/* Cringe Meter Panel - MOVED UP and styled INDUSTRIAL */}
                <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000] p-4">
                  <h3 className="font-industrial text-2xl tracking-widest uppercase mb-2 opacity-60">Vibe Check</h3>

                  <CringeMeter score={result.score} />
                  {/* Cringe Words */}
                  {result.cringe_words && result.cringe_words.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1.5">Cringe Evidence 🚨</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.cringe_words.map((word, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#FFDE59] text-black text-[11px] font-black border-2 border-black uppercase"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000] p-5">
                  <h3 className="font-industrial text-3xl tracking-wide uppercase mb-4 border-b-2 border-black pb-2">
                    Actions
                  </h3>


                  {/* Download */}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#FF914D] text-black font-bold uppercase text-xs border-2 border-black mb-3 hover:bg-[#e8802e] transition-colors disabled:opacity-60"
                  >
                    <span>Download Receipt</span>
                    {isDownloading ? (
                      <span className="animate-spin text-base">⏳</span>
                    ) : (
                      <Download size={15} />
                    )}
                  </button>

                  {/* Share Preview */}
                  <button
                    onClick={handleShareClick}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#5CE1E6] text-black font-bold uppercase text-xs border-2 border-black mb-3 hover:bg-[#43cdd2] transition-colors disabled:opacity-60"
                  >
                    <span>Expose Yourself 📸</span>
                    <Share2 size={15} />
                  </button>

                  {/* Roast another */}
                  <button
                    onClick={onClose}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white text-black font-bold uppercase text-xs border-2 border-black hover:bg-gray-100 transition-colors"
                  >
                    <span>Roast Another</span>
                    <MessageCircle size={15} />
                  </button>
                </div>



              </div>
            </div>
          </div>
        )}

        {/* ── SHARE PREVIEW MODAL ───────────────────────── */}
        {showSharePreview && previewImage && (
          <div
            className="fixed inset-0 z-[70] flex flex-col items-center p-4 py-8 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowSharePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-auto mb-auto bg-[#fffdf5] border-4 border-black p-5 w-full max-w-md shadow-[8px_8px_0_0_#000] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSharePreview(false)}
                className="absolute -top-4 -right-4 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition-transform"
              >
                <X size={18} />
              </button>

              <h3 className="font-black text-2xl uppercase mb-4 text-center">Share My Trauma</h3>

              <div className="relative w-full aspect-[3/4] mb-4 bg-gray-200 border-2 border-black overflow-hidden rounded">
                <Image src={previewImage} alt="Roast Preview" fill className="object-contain p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `I got roasted by PitchSlap! 🔥 Score: ${result?.score}/100\n"${result?.roast.substring(0, 60)}..."\nRoast yourself at pitchslap.netlify.app`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 font-bold text-sm border-2 border-black hover:-translate-y-0.5 transition-transform"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I just got destroyed by PitchSlap! 💀 Score: ${result?.score}/100\n"${result?.roast.substring(0, 80)}..."\nRoast yourself: pitchslap.netlify.app`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black text-white py-3 font-bold text-sm border-2 border-black hover:-translate-y-0.5 transition-transform"
                >
                  X / Twitter
                </a>
                <button
                  onClick={handleDownload}
                  className="col-span-2 flex items-center justify-center gap-2 bg-[#FFDE59] text-black py-3 font-bold text-sm border-2 border-black hover:-translate-y-0.5 transition-transform uppercase"
                >
                  <Download size={17} /> Download Image
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── FAKE DOOR MODAL ──────────────────────────── */}
        {showFakeDoor && (
          <div
            className="fixed inset-0 z-[80] flex flex-col items-center p-4 py-8 bg-black/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setShowFakeDoor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-auto mb-auto bg-[#5CE1E6] border-4 border-black p-6 md:p-8 w-full max-w-md shadow-[12px_12px_0_0_#fff] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFakeDoor(false)}
                className="absolute -top-4 -right-4 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition-transform"
              >
                <X size={18} />
              </button>

              {!waitlistSuccess ? (
                <>
                  <h3 className="font-heading font-black text-3xl uppercase mb-2 leading-none">
                    You caught us early! 🫣
                  </h3>
                  <p className="font-bold text-lg mb-6 leading-snug">
                    The Extension drops next week.{" "}
                    <span className="bg-black text-white px-1">480 people</span> are already in.
                  </p>
                  <form 
                    onSubmit={async (e) => { 
                      e.preventDefault(); 
                      try {
                        await fetch('/api/waitlist', {
                          method: 'POST',
                          body: JSON.stringify({ email: emailWaitlist })
                        });
                        setWaitlistSuccess(true);
                      } catch (err) {
                        console.error("Waitlist error", err);
                        // Still show success to user for better UX on "fake door"
                        setWaitlistSuccess(true);
                      }
                    }} 
                    className="flex flex-col gap-4"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter email to get 50% off"
                      value={emailWaitlist}
                      onChange={(e) => setEmailWaitlist(e.target.value)}
                      className="w-full p-4 border-2 border-black font-bold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-4 bg-black text-white font-black uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                      Join Waitlist
                    </button>
                  </form>
                  <p className="text-xs font-bold mt-4 opacity-60 text-center">
                    We won&apos;t spam you. We&apos;re too lazy.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="font-heading font-black text-2xl uppercase mb-2">
                    You&apos;re on the list!
                  </h3>
                  <p className="font-bold mb-8">We&apos;ll roast your inbox soon.</p>
                  <button
                    onClick={() => setShowFakeDoor(false)}
                    className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ── FEEDBACK MODAL ──────────────────────────── */}
        <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
      </motion.div>
    </AnimatePresence>
  );
}
