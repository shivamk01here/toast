"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [vibe, setVibe] = useState<string | null>(null);
  const [characterRequest, setCharacterRequest] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track feedback
    fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ vibe, characterRequest, feedbackText, email })
    }).catch(console.error);
    
    setSubmitted(true);
  };

  if (!isOpen) { 
    return null; 
  } else {
    console.log("FeedbackModal Rendered Open");
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
              <h2 className="font-heading font-black text-3xl md:text-4xl uppercase mb-1 leading-none text-center">
                HELP US MAKE THIS WORSE.
              </h2>
              <p className="text-center font-bold text-sm opacity-60 mb-6 uppercase">
                (Did we hurt your feelings? Tell us.)
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECTION A: VIBE CHECK */}
                <div className="space-y-2">
                  <label className="block font-black uppercase text-sm border-b-2 border-black/10 pb-1">
                    How much emotional damage did we cause?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { emoji: "😒", label: "Meh", value: "meh" },
                      { emoji: "😐", label: "Mid", value: "mid" },
                      { emoji: "🔥", label: "Cooked", value: "cooked" },
                      { emoji: "💀", label: "I'm Dead", value: "dead" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setVibe(option.value)}
                        className={`flex flex-col items-center justify-center p-2 border-2 transition-all ${
                          vibe === option.value
                            ? "border-black bg-[#FFDE59] shadow-[2px_2px_0_0_#000] translate-x-[1px] translate-y-[1px]"
                            : "border-black/20 bg-white hover:border-black hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-2xl mb-1">{option.emoji}</span>
                        <span className="text-[10px] font-bold uppercase">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION B: CHARACTER REQUEST */}
                <div className="space-y-2">
                  <label className="block font-black uppercase text-sm border-b-2 border-black/10 pb-1">
                    Who should we add to roast you next?
                  </label>
                  <input
                    type="text"
                    value={characterRequest}
                    onChange={(e) => setCharacterRequest(e.target.value)}
                    placeholder="e.g., Donald Trump, My Ex-Wife, Voldemort..."
                    className="w-full p-3 border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#5CE1E6]/50 bg-white"
                  />
                </div>

                {/* SECTION C: LOVE/HATE BOX */}
                <div className="space-y-2">
                  <label className="block font-black uppercase text-sm border-b-2 border-black/10 pb-1">
                    Your Email (Optional - We&apos;ll notify you on fix)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-3 border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#5CE1E6]/50 bg-white"
                  />
                </div>

                {/* SECTION D: FEEDBACK */}
                <div className="space-y-2">
                  <label className="block font-black uppercase text-sm border-b-2 border-black/10 pb-1">
                    Roast the Dev (or glaze me)
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Your UI is ugly but the roasts are funny..."
                    rows={3}
                    maxLength={500}
                    className="w-full p-3 border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#5CE1E6]/50 bg-white resize-none"
                  />
                  <p className={`text-right text-xs font-bold mt-1 ${
                    feedbackText.length >= 480 ? "text-red-500" : "text-black/30"
                  }`}>{feedbackText.length}/500</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#FF914D] hover:text-black hover:border-black border-2 border-transparent transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none"
                >
                  SEND HATEMAIL 🚀
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">😈</div>
              <h3 className="font-heading font-black text-2xl uppercase mb-2">Message Received.</h3>
              <p className="font-bold mb-6">
                {email ? "We'll notify you when we fix it." : "We'll probably ignore it, but thanks anyway."}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
               >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
