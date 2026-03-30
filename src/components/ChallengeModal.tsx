import React, { useState } from 'react';
import { Challenge } from '../types';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
  onComplete: (challenge: Challenge) => void;
}

export default function ChallengeModal({ challenge, onClose, onComplete }: ChallengeModalProps) {
  const [answer, setAnswer] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for demo
    // In a real app, logic would be more complex or server-side
    const isCorrect = answer.toLowerCase().trim() === challenge.content.answer.toLowerCase().trim();

    if (isCorrect) {
      setIsSuccess(true);
      // Wait a bit for the user to see the success message, then trigger completion
      setTimeout(async () => {
        try {
          await onComplete(challenge);
        } catch (error) {
          setIsSuccess(false);
          setIsError(true);
        }
      }, 1500);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transition-colors"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{challenge.category}</span>
            <h2 className="text-xl font-black">{challenge.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              {challenge.description}
            </p>
            
            {challenge.content.question && (
              <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 transition-colors">
                {challenge.content.question}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Your Answer</label>
              <input
                autoFocus
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none transition-all font-medium text-slate-900 dark:text-white"
              />
            </div>

            <AnimatePresence mode="wait">
              {isError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-bold bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl"
                >
                  <AlertCircle size={16} />
                  <span>Incorrect answer. Try again!</span>
                </motion.div>
              )}
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl"
                >
                  <CheckCircle2 size={16} />
                  <span>Correct! Challenge completed.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
            >
              SUBMIT ANSWER
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
