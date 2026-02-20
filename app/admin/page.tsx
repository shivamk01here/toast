"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ip })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to whitelist IP");
      }

      setMessage({ type: 'success', text: data.message || `Successfully whitelisted ${ip}` });
      setIp(""); // Clear IP field on success
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#5CE1E6] font-mono p-4 flex flex-col items-center justify-center selection:bg-[#FF66C4] selection:text-white">
      
      <div className="w-full max-w-md bg-[#111] border-4 border-[#FFDE59] p-8 shadow-[8px_8px_0_0_#FFDE59]">
        <div className="flex flex-col items-center mb-8">
          <Image src="/icon.png" alt="PitchSlap Logo" width={80} height={80} className="w-16 h-16 invert mb-4" />
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#FFDE59] font-industrial">Admin Portal</h1>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-2">IP Whitelist Management</p>
        </div>

        {message && (
          <div className={`p-4 mb-6 border-2 font-bold text-sm ${message.type === 'success' ? 'bg-green-900/40 border-green-500 text-green-400' : 'bg-red-900/40 border-red-500 text-red-400'}`}>
            {message.type === 'success' ? <ShieldCheck size={18} className="inline mr-2" /> : <Lock size={18} className="inline mr-2" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-white">Admin Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black border-2 border-[#5CE1E6] text-white focus:outline-none focus:border-[#FF66C4] transition-colors font-sans"
              placeholder="Enter master password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-white">Target IP Address</label>
            <input 
              type="text" 
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full p-3 bg-black border-2 border-[#5CE1E6] text-white focus:outline-none focus:border-[#FF66C4] transition-colors font-sans"
              placeholder="e.g. 192.168.1.1"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#FFDE59] text-black font-black uppercase text-lg border-2 border-transparent hover:bg-yellow-300 disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Grant Unlimited Access"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-white/40 hover:text-white uppercase font-bold underline underline-offset-4">
            Return to App
          </Link>
        </div>
      </div>

    </div>
  );
}
