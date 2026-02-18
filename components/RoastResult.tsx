"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clipboard, CopyCheck, ShieldAlert } from "lucide-react";
import { RoastResultData } from "@/types/roast";

interface RoastResultProps {
  result: RoastResultData;
}

export default function RoastResult({ result }: RoastResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 850;

    const animate = (time: number) => {
      const ratio = Math.min((time - start) / duration, 1);
      setDisplayScore(Math.round(result.score * ratio));
      if (ratio < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [result.score]);

  const stamp = result.score < 35 ? "CRINGE" : "REJECTED";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ticket-cut neo-box relative overflow-hidden bg-[#f0fff4]"
    >
      <div className="border-b-[3px] border-black bg-[#5CE1E6] p-4">
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-black">
          Burn Ward Report
        </p>
      </div>

      <div className="crime-stamp absolute right-4 top-16 rounded px-3 py-1 font-heading text-lg font-extrabold">
        {stamp}
      </div>

      <div className="space-y-6 p-5">
        <div>
          <div className="flex items-end gap-2">
            <p className="font-heading text-6xl leading-none text-[#dc2626]">{displayScore}</p>
            <p className="pb-1 font-heading text-lg">/100</p>
          </div>
          <p className="mt-3 border-2 border-black bg-white p-3 text-sm font-bold text-neutral-800">
            {result.roast}
          </p>
        </div>

        <div>
          <p className="mb-2 font-heading text-xs uppercase tracking-[0.2em] text-neutral-600">
            Cringe Evidence
          </p>
          <div className="flex flex-wrap gap-2">
            {result.cringe_words.length > 0 ? (
              result.cringe_words.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 border-2 border-black bg-[#FF914D] px-2 py-1 text-xs font-bold"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {word}
                </span>
              ))
            ) : (
              <span className="border-2 border-black bg-white px-2 py-1 text-xs">
                No obvious buzzwords detected
              </span>
            )}
          </div>
        </div>

        <div className="relative border-2 border-black bg-[#FFDE59] p-3">
          <div className="absolute -top-3 right-2 border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
            THE FIX
          </div>
          <button
            onClick={handleCopy}
            className="neo-btn absolute right-2 top-2 inline-flex items-center gap-1 bg-white px-2 py-1 text-[10px] font-bold uppercase"
          >
            {copied ? <CopyCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <pre className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-neutral-900">{result.fix}</pre>
        </div>
      </div>
    </motion.section>
  );
}
