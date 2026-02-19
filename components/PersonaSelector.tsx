import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Book } from "lucide-react";
import CharacterGalleryModal from "@/components/CharacterGalleryModal";
import { PERSONAS, PERSONA_CATEGORIES, PersonaConfig } from "@/lib/personas";
import { PersonaCategory, PersonaKey } from "@/types/roast";
import { EXECUTIONER_TITLES } from "@/lib/quotes";

interface PersonaSelectorProps {
  selected: PersonaKey | null;
  onChange: (persona: PersonaKey) => void;
}

const CATEGORY_LABELS: Record<"all" | PersonaCategory, string> = {
  all: "ALL",
  sales: "SALES",
  desi: "🇮🇳 DESI",
  tv: "📺 TV",
  tech: "💻 TECH",
  cringe: "🤡 CRINGE",
  hollywood: "🎬 HOLLYWOOD",
  anime: "🎌 ANIME",
  medieval: "⚔️ MEDIEVAL",
  sigma: "🗿 SIGMA"
};

const CATEGORY_COLORS: Record<"all" | PersonaCategory, string> = {
  all: "#FFDE59",
  sales: "#128f98",
  desi: "#FF914D",
  tv: "#FFDE59",
  tech: "#5CE1E6",
  cringe: "#FF66C4",
  hollywood: "#FF914D",
  anime: "#FF66C4",
  medieval: "#5CE1E6",
  sigma: "#808080" // Grayscale/Silver for Sigma
};

export default function PersonaSelector({ selected, onChange }: PersonaSelectorProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [category, setCategory] = useState<"all" | PersonaCategory>("all");
  const [sectionTitle, setSectionTitle] = useState("CHOOSE YOUR EXECUTIONER");
  
  // Update title on mount
  useEffect(() => {
    setSectionTitle(EXECUTIONER_TITLES[Math.floor(Math.random() * EXECUTIONER_TITLES.length)]);
  }, []);

  // Track active persona object to get its color for styling
  const activePersona = selected ? PERSONAS.find(p => p.id === selected) : null;

  const filtered = useMemo(() => {
    if (category === "all") return PERSONAS;
    return PERSONAS.filter((persona) => persona.category === category);
  }, [category]);

  return (
    <section className="w-full mb-4">
      {/* Category Tabs */}
      <div className="flex gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
        {PERSONA_CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{ 
                backgroundColor: isActive ? CATEGORY_COLORS[cat] : 'transparent',
                borderColor: isActive ? '#1a1a1a' : 'transparent',
                opacity: isActive ? 1 : 0.5,
                boxShadow: isActive ? '2px 2px 0px #1a1a1a' : 'none'
              }}
              className={`category-tab px-4 py-1 text-xs font-bold rounded-full transition-all border-2 text-black whitespace-nowrap`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      <div className="mb-2 flex items-center gap-2">
         <span className="font-simple text-xl md:text-2xl font-bold uppercase text-red-600 animate-pulse tracking-tight">
            {sectionTitle}
         </span>
      </div>

      {/* Slider Area */}
      <div className="flex gap-4 items-stretch h-36 md:h-44">
        <div className="flex-1 neo-box p-3 bg-white flex items-center overflow-x-auto relative no-scrollbar">
          <div className="flex items-center gap-4 px-2 min-w-full">
            {filtered.map((persona) => {
              const active = selected === persona.id;
              
              return (
                <button
                  key={persona.id}
                  onClick={() => onChange(persona.id)}
                  className={`relative group flex-shrink-0 transition-all duration-300 ${active ? 'z-10 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                >
                  <div 
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 overflow-hidden relative shadow-lg ${active ? 'border-[#FF0000] shadow-[0_0_15px_#FF0000]' : 'border-black'}`}
                  >
                    <Image
                      src={persona.cardGif}
                      alt={persona.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {active && <div className="absolute inset-0 bg-red-500/20 animate-pulse" />}
                  </div>
                  
                  <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black ${active ? 'bg-[#FF0000] text-white' : 'bg-white text-black'}`}>
                    {persona.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setGalleryOpen(true)}
          className="neo-btn bg-[#FF914D] text-black border-[3px] border-black w-24 flex flex-col items-center justify-center gap-1 shrink-0 group hover:bg-[#FF8030] shadow-[4px_4px_0_0_#000]"
        >
          <span className="text-3xl group-hover:rotate-12 transition-transform">🎪</span>
          <span className="text-[10px] font-black text-center leading-tight uppercase">VIEW<br />ALL</span>
        </button>
      </div>

      <CharacterGalleryModal
        open={galleryOpen}
        selected={selected}
        onClose={() => setGalleryOpen(false)}
        onSelect={onChange}
      />
    </section>
  );
}
