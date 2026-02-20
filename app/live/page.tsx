"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Globe2, Activity, Clock } from "lucide-react";

interface LiveData {
  activeUsers: number;
  activeCountries: Record<string, number>;
  characterStats: Record<string, number>;
}

export default function LiveStats() {
  const [data, setData] = useState<LiveData | null>(null);
  const [error, setError] = useState(false);

  const fetchLiveStats = async () => {
    try {
      const res = await fetch(`/api/live?t=${Date.now()}`);
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      setData(json);
      setError(false);
    } catch (err) {
      console.error("Failed to fetch live stats", err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-[#5CE1E6] font-mono flex items-center justify-center p-4">
        <div className="text-center border-4 border-red-600 p-8 shadow-[8px_8px_0_0_#dc2626]">
          <h1 className="text-3xl font-black mb-4">SYSTEM FAILURE</h1>
          <p>Unable to establish connection with live servers.</p>
          <Link href="/" className="mt-8 inline-block px-6 py-2 bg-white text-black font-bold uppercase hover:bg-gray-200 border-2 border-black">
            Return to Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#5CE1E6] font-mono p-4 md:p-8 selection:bg-[#FF66C4] selection:text-white pb-20">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b-2 border-white/20 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
             <Image src="/icon.png" alt="PitchSlap Logo" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 invert" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">Live Status</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="text-[10px] uppercase font-bold text-green-500 tracking-widest">Global Network Online</span>
            </div>
          </div>
        </div>
        <Link href="/" className="hidden md:inline-block px-4 py-2 bg-white text-black text-xs font-black uppercase border-2 border-transparent hover:bg-[#FFDE59] transition-colors">
          &larr; Back to Roast
        </Link>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - MAIN STATS */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Active Users Block */}
          <div className="bg-[#111] border-2 border-[#5CE1E6] p-6 shadow-[4px_4px_0_0_#5CE1E6] relative overflow-hidden">
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2 flex items-center gap-2">
              <Users size={16} /> Current Victims
            </h2>
            <div className="text-7xl font-black text-white font-industrial">
              {data ? data.activeUsers.toLocaleString() : "..."}
            </div>
            {/* Decorative background grid */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-grid opacity-10 pointer-events-none" />
          </div>

          {/* Countries Block */}
          <div className="bg-[#111] border-2 border-[#FF66C4] p-6 shadow-[4px_4px_0_0_#FF66C4]">
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-4 flex items-center gap-2 text-[#FF66C4]">
              <Globe2 size={16} /> Top Regions
            </h2>
            <div className="space-y-3">
              {!data ? (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-white/10 w-full" />
                  <div className="h-4 bg-white/10 w-3/4" />
                </div>
              ) : Object.keys(data.activeCountries).length === 0 ? (
                <p className="text-xs text-white/50 italic">Ghost town.</p>
              ) : (
                Object.entries(data.activeCountries)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([country, count]) => (
                    <div key={country} className="flex justify-between items-center text-sm font-bold">
                      <span className="text-white">{country}</span>
                      <span className="bg-[#FF66C4] text-black px-2 py-0.5">{count as number}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - CHARACTER USAGE */}
        <div className="lg:col-span-2">
          <div className="bg-[#111] border-2 border-[#FFDE59] p-6 shadow-[6px_6px_0_0_#FFDE59] h-full flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-6 flex items-center gap-2 text-[#FFDE59]">
              <Activity size={16} /> Character Usage Stats
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[600px] custom-scrollbar">
              {!data ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-white/5 border border-white/10 animate-pulse" />
                  ))}
                </div>
              ) : Object.keys(data.characterStats).length === 0 ? (
                <p className="text-xs text-white/50 italic text-center py-10">No roasts recorded yet...</p>
              ) : (
                Object.entries(data.characterStats)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([char, count], idx) => (
                    <div 
                      key={char} 
                      className="border-l-4 p-4 bg-black flex items-center justify-between gap-4"
                      style={{
                        borderColor: idx === 0 ? '#FFDE59' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#fff'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-800 border-2 border-white/20">
                          <Image src={`/personas/${char}.gif`} alt={char} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                            <div className="text-lg font-black uppercase text-white">
                              {char}
                            </div>
                            <div className="text-[10px] text-white/50 font-bold tracking-widest uppercase">
                              {idx === 0 ? '🏆 Most Popular' : 'Active Roast Master'}
                            </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-industrial font-black text-[#FFDE59]">{count as number}</span>
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Total Roasts</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
            
          </div>
        </div>

      </main>

    </div>
  );
}
