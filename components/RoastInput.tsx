"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PersonaConfig } from "@/lib/personas";
import { ROAST_BUTTON_QUOTES } from "@/lib/quotes";

interface RoastInputProps {
  value: string;
  disabled: boolean;
  selectedPersona: PersonaConfig | null;
  onChange: (value: string) => void;
  onRoast: () => void;
}

export default function RoastInput({ value, disabled, selectedPersona, onChange, onRoast }: RoastInputProps) {
  const [buttonText, setButtonText] = useState("ROAST ME");

  useEffect(() => {
    let categoryQuotes = ROAST_BUTTON_QUOTES.default;
    
    if (selectedPersona?.category === 'desi') {
      categoryQuotes = ROAST_BUTTON_QUOTES.desi;
    } else if (selectedPersona?.category === 'tech' || selectedPersona?.category === 'sales') {
      categoryQuotes = ROAST_BUTTON_QUOTES.tech;
    } else if (selectedPersona?.category === 'cringe') {
      categoryQuotes = ROAST_BUTTON_QUOTES.genz;
    } else if (selectedPersona?.category === 'tv') {
      categoryQuotes = ROAST_BUTTON_QUOTES.hollywood;
    } else if (selectedPersona?.category === 'hollywood') {
      categoryQuotes = ROAST_BUTTON_QUOTES.hollywood;
    } else if (selectedPersona?.category === 'anime') {
      categoryQuotes = ROAST_BUTTON_QUOTES.anime;
    } else if (selectedPersona?.category === 'medieval') {
      categoryQuotes = ROAST_BUTTON_QUOTES.medieval;
    }

    const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    setButtonText(randomQuote);
  }, [selectedPersona]);

  return (
    <div className="neo-box p-0 flex flex-col h-full bg-white relative min-h-[300px]">
      <div className="border-b-[3px] border-black p-3 bg-[#e0e0e0] flex justify-between items-center">
        <span className="font-black text-sm uppercase tracking-widest text-black flex items-center gap-2">
          <span className="text-xl">✍️</span> PASTE YOUR PITCH
        </span>
        <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 font-bold">
          {value.length} CHARS
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`Dear Sir/Madam,\n\nI hope this email finds you well. I wanted to reach out regarding a unique opportunity...`}
        className="flex-1 w-full p-5 resize-none outline-none font-mono text-sm bg-white text-black placeholder:text-gray-400 focus:bg-[#FFF9E5] transition-colors"
      />

      <motion.button
        onClick={onRoast}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{ 
          x: [0, -2, 2, -2, 2, 0],
          transition: { repeat: Infinity, duration: 0.5, repeatDelay: 3 } 
        }}
        className="w-full py-5 bg-[#FF914D] border-t-[3px] border-black font-black text-xl uppercase tracking-widest flex items-center justify-center gap-2 group text-white transition-colors hover:bg-[#ff7b29]"
      >
        <span>🔥 {buttonText}</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </motion.button>
    </div>
  );
}
