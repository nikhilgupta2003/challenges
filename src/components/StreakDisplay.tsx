import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  totalCompletions: number;
  onViewHistory?: () => void;
}

export default function StreakDisplay({ 
  currentStreak, 
  longestStreak, 
  totalPoints, 
  totalCompletions,
  onViewHistory 
}: StreakDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Flame size={24} />
          </div>
          <span className="text-sm font-medium opacity-90 uppercase tracking-wider">Current Streak</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black">{currentStreak}</span>
          <span className="text-xl font-bold opacity-80">DAYS</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Trophy size={24} />
          </div>
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Longest Streak</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900 dark:text-white">{longestStreak}</span>
          <span className="text-lg font-bold text-slate-400 dark:text-slate-500">DAYS</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <Trophy size={24} />
          </div>
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Points</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900 dark:text-white">{totalPoints}</span>
          <span className="text-lg font-bold text-slate-400 dark:text-slate-500">PTS</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onViewHistory}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
            <Calendar size={24} />
          </div>
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completions</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{totalCompletions}</span>
            <span className="text-lg font-bold text-slate-400 dark:text-slate-500">DONE</span>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">View History</span>
        </div>
      </motion.div>
    </div>
  );
}
