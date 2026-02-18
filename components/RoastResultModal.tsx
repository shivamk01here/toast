"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { PersonaConfig } from "@/lib/personas";
import { RoastResultData } from "@/types/roast";

interface RoastResultModalProps {
  open: boolean;
  result: RoastResultData | null;
  persona: PersonaConfig;
  onClose: () => void;
}

export default function RoastResultModal({
  open,
  result,
  persona,
  onClose
}: RoastResultModalProps) {
  if (!result) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={open ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="neo-box z-10 w-full max-w-2xl bg-[#f0fff4] flex flex-col overflow-hidden max-h-[90vh]"
      >
        <div className="bg-[#5CE1E6] border-b-[3px] border-black p-4 flex items-center gap-3">
          <Image
            src={persona.roastGif}
            alt={persona.name}
            width={48}
            height={48}
            unoptimized
            className="w-12 h-12 rounded-full border-2 border-black bg-white object-cover"
          />
          <div>
            <h4 className="font-heading font-black uppercase text-sm">{persona.name}</h4>
            <div className="text-[10px] font-bold bg-white inline-block px-1 border border-black">
              VERDICT: TRASH 🗑️
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6 relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#FF914D]"></div>
            <p className="pl-4 font-bold text-base leading-relaxed text-gray-800">
              {result.roast}
            </p>
          </div>

          <div className="bg-[#FFDE59] p-3 border-2 border-black text-xs font-mono relative mt-6 transform rotate-1">
            <div className="absolute -top-3 right-2 bg-black text-white px-2 py-0.5 text-[10px] font-bold">
              THE FIX
            </div>
            <p className="whitespace-pre-wrap">{result.fix}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-5 bg-black text-white text-xs font-bold uppercase hover:bg-gray-800 transition-colors"
        >
          Submit Another Victim
        </button>
      </motion.div>
    </div>
  );
}
