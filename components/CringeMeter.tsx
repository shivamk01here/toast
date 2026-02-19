"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CringeMeterProps {
  score: number; // 0 (Cringe) to 100 (Based)
}

export default function CringeMeter({ score }: CringeMeterProps) {
  const [rotation, setRotation] = useState(-90);

  useEffect(() => {
    // Map score 0-100 to rotation -90deg to 90deg
    const targetRotation = -90 + (score / 100) * 180;
    setRotation(targetRotation);
  }, [score]);

  const isFire = score < 20;

  return (
    <div className="relative w-48 h-24 sm:w-64 sm:h-32 flex justify-center items-end overflow-hidden mb-4">
      {/* Gauge Background */}
      <div className="absolute bottom-0 w-full h-full bg-[#e0e0e0] rounded-t-full border-4 border-black border-b-0 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-[#FF0000] via-[#FFDE59] to-[#5CE1E6] opacity-80" />
      </div>

      {/* Ticks */}
      <div className="absolute bottom-0 w-full h-full">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[90%] border-t-[20px] border-dashed border-black/20 rounded-t-full pointer-events-none" />
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-4 text-[10px] sm:text-xs font-black uppercase text-black z-10">CRINGE</div>
      <div className="absolute bottom-2 right-4 text-[10px] sm:text-xs font-black uppercase text-black z-10">BASED</div>

      {/* Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-1 h-[85%] bg-black origin-bottom"
        animate={{ 
          rotate: isFire ? rotation + 2 : rotation // Base rotation
        }}
        transition={{ 
          type: "spring", 
          stiffness: 50, 
          damping: 10
        }}
        style={{ zIndex: 20 }}
      >
        <div className="w-4 h-4 bg-black rounded-full absolute -bottom-2 -left-1.5 border-2 border-white" />
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[20px] border-b-black absolute -top-4 -left-1" />
      </motion.div>
      
      {/* Fire Effect */}
      {isFire && (
        <div className="absolute inset-0 pointer-events-none z-30 flex justify-center items-end">
          <div className="text-4xl animate-bounce mb-4">🔥🔥🔥</div>
        </div>
      )}
    </div>
  );
}
