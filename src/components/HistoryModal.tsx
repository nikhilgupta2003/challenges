import React from 'react';
import { Completion, UserProfile } from '../types';
import { X, Calendar, Trophy, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';

interface HistoryModalProps {
  completions: Completion[];
  profile: UserProfile | null;
  onClose: () => void;
}

export default function HistoryModal({ completions, profile, onClose }: HistoryModalProps) {
  // Sort completions by date descending
  const sortedCompletions = [...completions].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-black">Your Progress</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {/* Stats Summary */}
          {profile && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 transition-colors">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                  <Flame size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
                </div>
                <div className="text-2xl font-black text-orange-700 dark:text-orange-300">{profile.currentStreak} Days</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 transition-colors">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                  <Trophy size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Points</span>
                </div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{profile.totalPoints}</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 transition-colors col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{completions.length}</div>
              </div>
            </div>
          )}

          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Completion History</h3>
          
          {sortedCompletions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600 transition-colors">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-slate-400 dark:text-slate-500 font-bold">No challenges completed yet.</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start your first challenge to see it here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCompletions.map((completion, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Challenge Completed</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        <span>{completion.category}</span>
                        <span>•</span>
                        <span>{format(parseISO(completion.completedAt), 'MMM do, h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 dark:text-emerald-400 font-black text-lg">+{completion.pointsEarned}</div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 dark:hover:bg-white transition-all active:scale-[0.98]"
          >
            CLOSE PROGRESS
          </button>
        </div>
      </motion.div>
    </div>
  );
}
