"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FakeDoorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FakeDoorModal({ isOpen, onClose }: FakeDoorModalProps) {
  const [emailWaitlist, setEmailWaitlist] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#5CE1E6] border-4 border-black p-6 md:p-8 w-full max-w-md shadow-[12px_12px_0_0_#fff] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition-transform"
          >
            <X size={18} />
          </button>

          {!waitlistSuccess ? (
            <>
              <h3 className="font-heading font-black text-3xl uppercase mb-2 leading-none">
                You caught us early! 🫣
              </h3>
              <p className="font-bold text-lg mb-6 leading-snug">
                The Extension drops next week.{" "}
                <span className="bg-black text-white px-1">480 people</span> are already in.
              </p>
              <form 
                onSubmit={async (e) => { 
                  e.preventDefault(); 
                  try {
                    await fetch('/api/waitlist', {
                      method: 'POST',
                      body: JSON.stringify({ email: emailWaitlist })
                    });
                    setWaitlistSuccess(true);
                  } catch (err) {
                    console.error("Waitlist error", err);
                    setWaitlistSuccess(true);
                  }
                }} 
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter email to get 50% off"
                  value={emailWaitlist}
                  onChange={(e) => setEmailWaitlist(e.target.value)}
                  className="w-full p-4 border-2 border-black font-bold focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-black uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Join Waitlist
                </button>
              </form>
              <p className="text-xs font-bold mt-4 opacity-60 text-center">
                We won&apos;t spam you. We&apos;re too lazy.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-heading font-black text-2xl uppercase mb-2">
                You&apos;re on the list!
              </h3>
              <p className="font-bold mb-8">We&apos;ll roast your inbox soon.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
