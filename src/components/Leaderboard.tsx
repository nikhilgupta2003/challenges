import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Medal, Crown, X, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardProps {
  users: UserProfile[];
  onClose: () => void;
}

export default function Leaderboard({ users, onClose }: LeaderboardProps) {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transition-colors"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Crown size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Leaderboard</h2>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Top Challengers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="space-y-3">
            {users.map((user, index) => {
              const rankColor = index === 0 ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 
                               index === 1 ? 'text-slate-400 bg-slate-50 dark:bg-slate-800' : 
                               index === 2 ? 'text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 
                               'text-slate-400 bg-slate-50 dark:bg-slate-800';
              
              return (
                <motion.div 
                  key={user.uid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleUserClick(user.uid)}
                  className={`flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer group ${
                    index === 0 ? 'border-amber-200 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${rankColor}`}>
                      {index === 0 ? <Crown size={20} /> : index + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {user.displayName || 'Anonymous'}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {user.currentStreak} Day Streak
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-600 dark:text-indigo-400 font-black text-xl">{user.totalPoints}</div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Points</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors">
          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 dark:hover:bg-white transition-all active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-none"
          >
            CLOSE LEADERBOARD
          </button>
        </div>
      </motion.div>
    </div>
  );
}
