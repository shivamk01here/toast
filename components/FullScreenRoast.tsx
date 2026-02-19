"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Copy, Check } from "lucide-react";
import Image from "next/image";
// @ts-ignore
import { toPng } from "html-to-image";
import { PersonaConfig } from "@/lib/personas";
import { RoastResultData } from "@/types/roast";
import { LOADING_MESSAGES } from "@/lib/quotes";
import CringeMeter from "./CringeMeter";

interface FullScreenRoastProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  persona: PersonaConfig | null;
  result: RoastResultData | null;
}

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

  // Handle Loading Messages
  useEffect(() => {
    if (loading && persona) {
      const initialMessage = persona.loadingMessage || LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      setCurrentMessage(initialMessage);

      const interval = setInterval(() => {
        const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        setCurrentMessage(randomMsg);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading, persona]);

  // Handle Copy
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

  // Handle Download Image
  const handleDownload = async () => {
    if (!roastCardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(roastCardRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `pitchslap-roast-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto"
      >
        {/* Close Button (Only show when checking result, not loading) */}
        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
        )}

        {/* LOADING STATE */}
        {loading && persona && (
          <div className="flex flex-col items-center justify-center text-center max-w-4xl w-full space-y-8">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[#FFDE59] overflow-hidden shadow-[0_0_50px_rgba(255,222,89,0.5)]"
            >
              <Image
                src={persona.roastGif}
                alt="Loading..."
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
            
            <div className="space-y-4">
              <motion.h2
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-simple text-xl md:text-3xl font-bold text-[#FFDE59] uppercase leading-relaxed drop-shadow-[2px_2px_0_#FF66C4] max-w-2xl px-4"
              >
                {currentMessage}
              </motion.h2>
              <div className="flex justify-center gap-2">
                <span className="w-3 h-3 bg-[#5CE1E6] animate-bounce delay-0"></span>
                <span className="w-3 h-3 bg-[#5CE1E6] animate-bounce delay-150"></span>
                <span className="w-3 h-3 bg-[#5CE1E6] animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {!loading && result && persona && (
          <div className="w-full max-w-6xl flex flex-col items-center gap-4 py-4 md:py-8 h-full justify-center">
            
            {/* Main Roast Card (To be screenshotted) */}
            <div
              ref={roastCardRef}
              className={`relative w-full max-w-5xl shrink-0 max-h-[85vh] flex flex-col overflow-hidden transition-all duration-500
                ${persona.category === 'sigma' ? 'grayscale contrast-125 bg-neutral-900 border-white text-white' : 'bg-[#fffdf5] border-black text-black'}
                border-[4px] shadow-[12px_12px_0_0_#000]
              `}
            >
              {/* TICKET HOLES DECORATION */}
              <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSItNSIgcj0iOCIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg==')] opacity-20" />
              <div className="absolute bottom-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIyNSIgcj0iOCIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg==')] opacity-20" />

              {/* TICKET HEADER */}
              <div className={`p-4 md:p-6 border-b-4 border-dashed ${persona.category === 'sigma' ? 'border-white/20' : 'border-black/20'} flex items-center gap-4 shrink-0`}>
                <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
                   <Image
                    src={persona.roastGif}
                    alt={persona.name}
                    fill
                    className={`object-cover rounded-md border-2 ${persona.category === 'sigma' ? 'border-white' : 'border-black'}`}
                    unoptimized
                  />
                  {/* STAMP */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-12 flex items-center justify-center border-4 border-red-600 rounded opacity-80 rotate-[-15deg] bg-white/50 backdrop-blur-sm mix-blend-multiply">
                    <span className="text-red-600 font-black text-xl uppercase tracking-widest">VIOLATION</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className={`font-mono text-xl md:text-3xl font-black uppercase tracking-tighter ${persona.category === 'sigma' ? 'text-white' : 'text-black'}`}>
                      CITATION #{Math.floor(Math.random() * 99999)}
                    </h3>
                    <div className="hidden md:block">
                      <CringeMeter score={result.score} />
                    </div>
                  </div>
                  <div className={`font-mono text-xs md:text-sm uppercase ${persona.category === 'sigma' ? 'text-gray-400' : 'text-gray-500'}`}>
                    OFFICER: {persona.name}
                  </div>
                  <div className={`font-mono text-xs md:text-sm uppercase ${persona.category === 'sigma' ? 'text-gray-400' : 'text-gray-500'}`}>
                    DATE: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="flex flex-col flex-1 min-h-0 p-4 md:p-6 gap-4 overflow-hidden">
                
                {/* Mobile Meter */}
                <div className="md:hidden self-center">
                   <CringeMeter score={result.score} />
                </div>

                {/* OFFENSE (The Roast) */}
                <div className="shrink-0 flex flex-col gap-1">
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${persona.category === 'sigma' ? 'text-gray-500' : 'text-gray-400'}`}>
                    OFFENSE DETAILS
                  </span>
                  <p className={`font-mono text-sm md:text-xl lg:text-2xl font-bold leading-tight ${persona.category === 'sigma' ? 'text-white' : 'text-black'} line-clamp-4 md:line-clamp-none`}>
                    "{result.roast}"
                  </p>
                </div>

                {/* PENALTY (The Fix) */}
                <div className={`relative flex-1 min-h-[120px] border-2 ${persona.category === 'sigma' ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'} p-4 overflow-y-auto`}>
                  <div className={`absolute top-0 left-0 px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${persona.category === 'sigma' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    CORRECTIVE ACTION
                  </div>
                  
                  <button 
                    onClick={handleCopy}
                    className={`absolute top-2 right-2 text-[10px] uppercase font-bold flex items-center gap-1 px-2 py-1 hover:bg-black/10 transition-colors ${persona.category === 'sigma' ? 'text-white border-white' : 'text-black border-black'} border`}
                  >
                    {isCopying ? <Check size={12} /> : <Copy size={12} />}
                    {isCopying ? "COPIED" : "COPY"}
                  </button>

                  <p className={`font-mono text-xs md:text-base leading-relaxed whitespace-pre-wrap mt-4 ${persona.category === 'sigma' ? 'text-gray-300' : 'text-gray-800'}`}>
                    {result.fix}
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className={`p-2 border-t-2 border-dashed ${persona.category === 'sigma' ? 'border-white/20' : 'border-black/10'} flex justify-between items-center opacity-50 shrink-0`}>
                <span className="font-mono text-[10px] uppercase">PITCHSLAP DEPARTMENT OF CORRECTIONS</span>
                <span className="font-mono text-[10px] uppercase">FINE: $0.00 (YOUR DIGNITY)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-4 bg-[#FF914D] text-black font-black uppercase tracking-wider border-2 border-black hover:bg-[#ff7b29] transition-transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0_0_#000]"
              >
                {isDownloading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Download size={20} />
                )}
                Share Shame
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-4 bg-white text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-gray-100 transition-transform hover:-translate-y-1 shadow-[4px_4px_0_0_#000]"
              >
                Start Over
              </button>
            </div>

          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
