import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
}

export default function StreakDisplay({ currentStreak, longestStreak, totalPoints }: StreakDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-200"
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
        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Trophy size={24} />
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Longest Streak</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900">{longestStreak}</span>
          <span className="text-lg font-bold text-slate-400">DAYS</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Trophy size={24} />
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Points</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900">{totalPoints}</span>
          <span className="text-lg font-bold text-slate-400">PTS</span>
        </div>
      </motion.div>
    </div>
  );
}
