"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PersonaConfig } from "@/lib/personas";
import { LOADING_MESSAGES } from "@/lib/quotes";

interface StatusPanelProps {
  loading: boolean;
  activePersona: PersonaConfig;
}

export default function StatusPanel({ loading, activePersona }: StatusPanelProps) {
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (loading) {
      // Pick a random message immediately, or use character specific one
      const initialMessage = activePersona.loadingMessage 
        ? activePersona.loadingMessage 
        : LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      
      setCurrentMessage(initialMessage);

      const interval = setInterval(() => {
        // Change message every 800ms for a chaotic feel
        const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        setCurrentMessage(randomMsg);
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center border-[3px] border-black bg-[#1a1a1a] p-8 text-center shadow-[4px_4px_0_0_#1a1a1a] overflow-hidden">
        
        {/* Background Glitch Effects (Optional decorative elements) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 text-xs font-mono text-[#5CE1E6] animate-pulse">SYSTEM_FAILURE</div>
            <div className="absolute bottom-10 right-10 text-xs font-mono text-[#FF66C4] animate-pulse">CRITICAL_ERROR</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-black uppercase leading-tight text-[#FFDE59] drop-shadow-[2px_2px_0_#FF66C4]">
              {currentMessage}
            </h2>
            <div className="mt-4 flex justify-center gap-2">
                 <span className="w-2 h-2 bg-[#5CE1E6] animate-bounce"></span>
                 <span className="w-2 h-2 bg-[#5CE1E6] animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-[#5CE1E6] animate-bounce delay-200"></span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                ANALYZING {activePersona.name} 'S RAGE LEVELS...
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white border-[3px] border-black p-6 shadow-[4px_4px_0_0_#1a1a1a]">
      <Image
        src="https://media.giphy.com/media/l2Je66zG6mAAZxgqI/giphy.gif"
        alt="Waiting..."
        width={96}
        height={96}
        unoptimized
        className="mb-4 h-24 w-24 rounded-full border-[3px] border-black object-cover shadow-[4px_4px_0_0_#5CE1E6]"
      />
      <h3 className="mb-2 font-heading text-xl font-black uppercase tracking-tight text-[#FF914D]">
        Silence is Golden
      </h3>
      <p className="max-w-[200px] text-xs text-gray-500 font-mono">
        But your pitch is probably lead. Select a character and hit the button.
      </p>
    </div>
  );
}
