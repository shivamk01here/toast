"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { PERSONAS, PERSONA_CATEGORIES } from "@/lib/personas";
import { PersonaCategory, PersonaKey } from "@/types/roast";

interface CharacterGalleryModalProps {
  open: boolean;
  selected: PersonaKey | null;
  onClose: () => void;
  onSelect: (persona: PersonaKey) => void;
}

const CATEGORY_COLORS: Record<"all" | PersonaCategory, string> = {
  all: "#FFDE59",
  sales: "#128f98",
  desi: "#FF914D",
  tv: "#FFDE59",
  tech: "#5CE1E6",
  cringe: "#FF66C4",
  hollywood: "#FF914D",
  anime: "#FF66C4",
  medieval: "#5CE1E6"
};

export default function CharacterGalleryModal({
  open,
  selected,
  onClose,
  onSelect
}: CharacterGalleryModalProps) {
  const [category, setCategory] = useState<"all" | PersonaCategory>("all");

  const filtered = useMemo(() => {
    if (category === "all") return PERSONAS;
    return PERSONAS.filter((persona) => persona.category === category);
  }, [category]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full h-full max-w-6xl bg-[#f4f1ea] border-4 border-black shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-[#FF914D] border-b-[3px] border-black p-4 flex justify-between items-center">
              <h2 
                className="font-heading font-black text-2xl uppercase text-white" 
                style={{ textShadow: "2px 2px 0px black" }}
              >
                Hall of Shame
              </h2>
              <button 
                onClick={onClose} 
                className="text-2xl font-black hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FFDE59] border-b-[3px] border-black p-2 flex gap-2 overflow-x-auto no-scrollbar">
               {Object.keys(CATEGORY_COLORS).map((cat) => (
                 <button
                   key={cat}
                   // @ts-ignore
                   onClick={() => setCategory(cat)}
                   className={`px-3 py-1 font-bold text-xs border-2 border-black uppercase whitespace-nowrap transition-transform hover:scale-105 ${
                     category === cat ? "bg-white text-black shadow-[2px_2px_0_0_black]" : "bg-black/10 text-black/50"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((persona) => {
                return (
                  <div
                    key={persona.id}
                    onClick={() => {
                      onSelect(persona.id);
                      onClose();
                    }}
                    className="cursor-pointer group relative"
                  >
                    <div className="bg-white border-2 border-black p-2 hover:bg-[#FFDE59] transition-colors h-full flex flex-col hover:shake-it">
                      <div className="h-32 overflow-hidden border border-black mb-2 flex-shrink-0">
                        <Image
                          src={persona.cardGif}
                          alt={persona.name}
                          width={320}
                          height={200}
                          unoptimized
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-heading font-black text-xs uppercase">{persona.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase">{persona.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
