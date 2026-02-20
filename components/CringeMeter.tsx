"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CringeMeterProps {
  score: number; // 0 (Cringe) to 100 (Based)
}

export default function CringeMeter({ score }: CringeMeterProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Inverted Logic:
    // Score 100 (Based) -> -90deg (Left)
    // Score 0 (Cringe) -> 90deg (Right)
    // Formula: 90 - (score / 100) * 180
    const targetRotation = 90 - (score / 100) * 180;
    setRotation(targetRotation);
  }, [score]);

  // Fire if score is low (High Cringe)
  const isFire = score < 20;

  return (
    <div className="relative w-full max-w-[200px] aspect-[2/1] mx-auto flex justify-center items-end overflow-hidden mb-4 scale-100 origin-bottom">

      {/* Gauge Background */}
      <div className="absolute bottom-0 w-full h-full bg-[#e0e0e0] rounded-t-full border-4 border-black border-b-0 overflow-hidden shadow-inner">
        {/* Gradient: Green (Left/Based) -> Yellow -> Red (Right/Cringe) */}
        <div className="w-full h-full bg-gradient-to-r from-[#5CE1E6] via-[#FFDE59] to-[#FF0000] opacity-90" />
      </div>

      {/* Ticks */}
      <div className="absolute bottom-0 w-full h-full">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[90%] border-t-[20px] border-dashed border-black/20 rounded-t-full pointer-events-none" />
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-5 text-[10px] sm:text-xs font-black uppercase text-black z-10 tracking-wider">BASED</div>
      <div className="absolute bottom-2 right-5 text-[10px] sm:text-xs font-black uppercase text-black z-10 tracking-wider">CRINGE</div>

      {/* Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-1.5 h-[85%] bg-black origin-bottom rounded-t-full"
        animate={{ 
          rotate: isFire ? [rotation - 2, rotation + 2, rotation - 1, rotation + 1, rotation] : rotation 
        }}
        transition={isFire ? {
            repeat: Infinity,
            duration: 0.2,
            ease: "easeInOut"
        } : { 
          type: "spring", 
          stiffness: 60, 
          damping: 12
        }}
        style={{ zIndex: 20 }}
      >
        <div className="w-5 h-5 bg-black rounded-full absolute -bottom-2.5 -left-[7px] border-4 border-white shadow-md" />
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[24px] border-b-black absolute -top-5 -left-[7px]" />
      </motion.div>
      
      {/* Fire Effect for Extreme Cringe */}
      {isFire && (
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-30 flex justify-center items-end h-full overflow-visible">
          <motion.div 
            animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-5xl absolute bottom-0 right-8 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          >
            🔥
          </motion.div>
           <motion.div 
            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }}
            className="text-4xl absolute bottom-4 right-16 drop-shadow-[0_0_10px_rgba(255,100,0,0.8)]"
          >
            🔥
          </motion.div>
        </div>
      )}
    </div>
  );
}
