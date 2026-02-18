"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Analyzing your desperation...",
  "Oh god, it's bad...",
  "Calling the cringe police...",
  "Confiscating your buzzwords...",
  "Preparing emotional damage report...",
  "Faxing this to your competitors for laughs..."
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);
  const progress = useMemo(() => Math.min((index + 1) * 20, 96), [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-box flex min-h-[320px] flex-col bg-[#1a1a1a] p-5"
    >
      <p className="border-b border-neutral-700 pb-2 font-body text-xs text-[#5CE1E6]">
        &gt; SYSTEM_STATUS: PUBLIC_HUMILIATION_PROTOCOL
      </p>

      <div className="mt-4 flex-1 space-y-2 font-body text-xs text-[#FFDE59]">
        {MESSAGES.slice(0, index + 1).map((line) => (
          <motion.p key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            &gt; {line.toUpperCase()}
          </motion.p>
        ))}
      </div>

      <div className="h-2 w-full bg-neutral-800">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25 }}
          className="h-full bg-[#FF914D]"
        />
      </div>
    </motion.section>
  );
}
