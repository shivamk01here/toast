"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, Search } from "lucide-react";
import { PERSONAS } from "@/lib/personas";
import { PersonaCategory, PersonaKey } from "@/types/roast";

interface CharacterGalleryModalProps {
  open: boolean;
  selected: PersonaKey | null;
  onClose: () => void;
  onSelect: (persona: PersonaKey) => void;
}

const CATEGORIES: Array<{ key: "all" | PersonaCategory; label: string; emoji: string }> = [
  { key: "all", label: "All", emoji: "🔥" },
  { key: "sales", label: "Sales", emoji: "💰" },
  { key: "desi", label: "Desi", emoji: "🇮🇳" },
  { key: "tv", label: "TV", emoji: "📺" },
  { key: "hollywood", label: "Hollywood", emoji: "🎬" },
  { key: "anime", label: "Anime", emoji: "🎌" },
  { key: "medieval", label: "Medieval", emoji: "⚔️" },
  { key: "cringe", label: "Cringe", emoji: "🤡" },
];

export default function CharacterGalleryModal({
  open,
  selected,
  onClose,
  onSelect
}: CharacterGalleryModalProps) {
  const [category, setCategory] = useState<"all" | PersonaCategory>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = category === "all" ? PERSONAS : PERSONAS.filter(p => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [category, query]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — slides up on mobile, scales in on desktop */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative w-full md:max-w-4xl md:max-h-[90vh] h-[90vh] md:h-auto bg-white md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-neutral-100 shrink-0">
              <div>
                <h2 className="font-heading font-black text-xl md:text-2xl uppercase leading-none tracking-tight">
                  Pick Your Trauma
                </h2>
                <p className="text-[11px] text-neutral-400 font-semibold mt-0.5 uppercase">
                  {filtered.length} executioners available
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Search + Categories */}
            <div className="px-4 pt-3 pb-2 space-y-3 shrink-0 border-b border-neutral-100">
              {/* Search */}
              <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-3 py-2">
                <Search size={15} className="text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search a character…"
                  className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-neutral-400"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-neutral-400 hover:text-black transition-colors">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase whitespace-nowrap border transition-all ${
                      category === cat.key
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-neutral-400">
                  <div className="text-4xl mb-3">🤷</div>
                  <p className="font-bold text-sm uppercase">No one found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filtered.map(persona => {
                    const isActive = selected === persona.id;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => { onSelect(persona.id); onClose(); }}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all active:scale-95 ${
                          isActive
                            ? "border-black ring-2 ring-black ring-offset-2"
                            : "border-transparent hover:border-neutral-300"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative aspect-square bg-neutral-100">
                          <Image
                            src={persona.cardGif}
                            alt={persona.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <span className="text-2xl">✓</span>
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="px-1.5 py-1.5 bg-white text-left">
                          <p className="font-black text-[10px] md:text-xs uppercase leading-tight line-clamp-2">{persona.name}</p>
                          <p className="text-[9px] text-neutral-400 uppercase font-semibold mt-0.5">{persona.category}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
