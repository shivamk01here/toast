"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PersonaConfig } from "@/lib/personas";
import { ROAST_BUTTON_QUOTES } from "@/lib/quotes";
import { RoastMode } from "@/types/roast";

interface RoastInputProps {
  value: string;
  mode: RoastMode;
  disabled: boolean;
  selectedPersona: PersonaConfig | null;
  onChange: (value: string) => void;
  onModeChange: (mode: RoastMode) => void;
  onRoast: () => void;
}

export default function RoastInput({ value, mode, disabled, selectedPersona, onChange, onModeChange, onRoast }: RoastInputProps) {
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

  const getPlaceholder = () => {
    switch (mode) {
      case 'linkedin':
        return `Driven by impact. Humbled by opportunities. Thrilled to announce...\n\n(Paste your "About" section or cringe post here)`;
      case 'resume':
        return `PROFESSIONAL SUMMARY\n\nMotivated self-starter with a passion for synergy and leveraging core competencies...\n\n(Paste your Resume summary or Skills here)`;
      default:
        return `Dear Sir/Madam,\n\nI hope this email finds you well. I wanted to reach out regarding a unique opportunity...`;
    }
  };

  return (
    <div className="neo-box p-0 flex flex-col h-full bg-white relative min-h-[500px]">
      <div className="border-b-[3px] border-black bg-[#e0e0e0] flex flex-col">
        {/* TABS */}
        <div className="flex border-b-[3px] border-black">
          {(["email", "linkedin", "resume"] as RoastMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex-1 py-3 font-black text-xs md:text-sm uppercase tracking-wider transition-colors border-r-[3px] border-black last:border-r-0 ${
                mode === m ? "bg-[#FFDE59] text-black" : "bg-white text-gray-400 hover:bg-gray-100"
              }`}
            >
              {m === "email" ? "📧 Cold Email" : m === "linkedin" ? "💼 LinkedIn" : "📄 Resume"}
            </button>
          ))}
        </div>

        {/* INFO BAR */}
        <div className="p-3 flex justify-between items-center bg-white">
          <span className="font-black text-xs md:text-sm uppercase tracking-widest text-black flex items-center gap-2">
            <span className="text-xl">
              {mode === "email" ? "✍️" : mode === "linkedin" ? "🤡" : "📄"}
            </span> 
            {mode === "email" ? "PASTE YOUR PITCH" : mode === "linkedin" ? "EXPOSE YOUR POST" : "ROAST YOUR CVS"}
          </span>
          <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 font-bold">
            {value.length} CHARS
          </span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={getPlaceholder()}
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
