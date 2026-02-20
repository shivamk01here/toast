"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ 
          type: 'waitlist',
          email,
          vibe: 'quota_exceeded'
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Waitlist Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center bg-black/90 backdrop-blur-sm p-4 py-8 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="mt-auto mb-auto relative w-full max-w-lg bg-[#fffdf5] border-4 border-black shadow-[8px_8px_0_0_#000] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-black text-white p-2 rounded-full border-2 border-white hover:scale-110 transition-transform z-10"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-[#FFDE59] p-4 rounded-2xl border-4 border-black rotate-3">
                    <Sparkles className="w-10 h-10 text-black" />
                  </div>
                </div>
                
                <h2 className="font-heading font-black text-3xl md:text-4xl uppercase mb-2 leading-none text-center">
                  LIMIT REACHED.
                </h2>
                <p className="text-center font-bold text-sm opacity-60 mb-8 uppercase">
                  (You&apos;ve used all 3 free roasts. Join the waitlist for unlimited access!)
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block font-black uppercase text-sm border-b-2 border-black/10 pb-1">
                      Drop your email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full p-4 pl-12 border-2 border-black font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFDE59]/50 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#FF914D] text-white font-black text-xl uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black hover:scale-[1.02] transition-all shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:shadow-none"
                  >
                    {loading ? "SAVING..." : "KEEP ME POSTED! 🚀"}
                  </button>
                </form>
                
                <p className="mt-6 text-[10px] font-bold text-center opacity-40 uppercase tracking-widest">
                  We promise not to span you. only roasts.
                </p>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-6xl mb-6 animate-bounce">🔥</div>
                <h3 className="font-heading font-black text-3xl uppercase mb-3">YOU&apos;RE ON THE LIST!</h3>
                <p className="font-bold text-lg mb-8">
                  We&apos;ll hit you up when we launch unlimited roasts. Stay toxic.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-black text-white font-black uppercase hover:bg-[#FFDE59] hover:text-black transition-colors border-2 border-black"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
