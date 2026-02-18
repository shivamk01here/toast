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
      }, 1500);

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="font-heading text-3xl md:text-5xl font-black text-[#FFDE59] uppercase leading-tight drop-shadow-[2px_2px_0_#FF66C4]"
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
          <div className="w-full max-w-6xl flex flex-col items-center gap-8 py-12">
            
            {/* Main Roast Card (To be screenshotted) */}
            <div
              ref={roastCardRef}
              className="bg-white border-[4px] border-black p-8 md:p-10 shadow-[12px_12px_0_0_#FF914D] max-w-5xl w-full relative overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF66C4] via-[#FFDE59] to-[#5CE1E6]" />
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FFDE59] rounded-full opacity-20 blur-3xl pointer-events-none" />

              {/* Header: Persona + Verdict */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b-2 border-dashed border-gray-200 pb-8">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={persona.roastGif}
                    alt={persona.name}
                    fill
                    className="object-cover rounded-full border-4 border-black shadow-[4px_4px_0_0_#000]"
                    unoptimized
                  />
                  <div className="absolute -bottom-2 -right-2 bg-black text-white px-3 py-1 font-heading text-xl md:text-2xl font-black uppercase rotate-[-3deg]">
                    TRASH 🗑️
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-heading text-4xl md:text-5xl font-black uppercase leading-[0.9] mb-2">
                    {persona.name}
                    <span className="block text-[#FF66C4] text-2xl md:text-3xl mt-1">
                      Rated Your Pitch
                    </span>
                  </h3>
                </div>
              </div>

              {/* The Roast */}
              <div className="mb-6">
                <h4 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  THE VERDICT
                </h4>
                <p className="font-simple text-xl md:text-3xl font-bold leading-tight text-black mb-4">
                  "{result.roast}"
                </p>
              </div>

               {/* The Fix */}
               <div className="bg-[#f0f0f0] p-6 border-2 border-black relative">
                <div className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 font-mono text-xs font-bold uppercase">
                  THE FIX
                </div>
                
                {/* Copy Button Positioned Here */}
                <button 
                  onClick={handleCopy}
                  className="absolute top-2 right-2 text-xs font-bold uppercase flex items-center gap-1 bg-white border border-black px-2 py-1 hover:bg-gray-100 transition-colors z-10"
                >
                  {isCopying ? <Check size={14} /> : <Copy size={14} />}
                  {isCopying ? "COPIED" : "COPY"}
                </button>

                <p className="font-simple text-base md:text-lg leading-relaxed text-gray-800 whitespace-pre-wrap mt-2">
                  {result.fix}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center opacity-60">
                <div className="font-heading font-black text-xl uppercase">
                  PITCH<span className="text-[#FF914D]">SLAP</span>
                </div>
                <div className="font-mono text-xs">
                  generated by AI (and pain)
                </div>
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
