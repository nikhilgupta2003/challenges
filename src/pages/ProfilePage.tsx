import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Completion } from '../types';
import { ArrowLeft, Flame, Trophy, CheckCircle2, Medal, Calendar, Star, Award, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';

interface ProfilePageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function ProfilePage({ darkMode, setDarkMode }: ProfilePageProps) {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        console.error("No userId found in URL params");
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching profile for userId: ${userId}`);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          console.log("User found:", userDoc.data());
          setProfile(userDoc.data() as UserProfile);
        } else {
          console.warn(`No user document found for ID: ${userId}`);
        }

        const completionsQuery = query(
          collection(db, 'completions'), 
          where('userId', '==', userId),
          orderBy('completedAt', 'desc')
        );
        const completionsSnap = await getDocs(completionsQuery);
        setCompletions(completionsSnap.docs.map(doc => doc.data() as Completion));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  const badges = [
    { id: 'streak-3', label: 'Streak Starter', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', condition: (p: UserProfile) => p.longestStreak >= 3 },
    { id: 'streak-7', label: 'Streak Master', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', condition: (p: UserProfile) => p.longestStreak >= 7 },
    { id: 'points-100', label: 'Century Club', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', condition: (p: UserProfile) => p.totalPoints >= 100 },
    { id: 'points-500', label: 'Point King', icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', condition: (p: UserProfile) => p.totalPoints >= 500 },
    { id: 'comp-5', label: 'Enthusiast', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', condition: (_: UserProfile, c: Completion[]) => c.length >= 5 },
    { id: 'comp-20', label: 'Grandmaster', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', condition: (_: UserProfile, c: Completion[]) => c.length >= 20 },
  ];

  const earnedBadges = profile ? badges.filter(b => b.condition(profile, completions)) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">User Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs">
          We couldn't find a profile for this user ID. They might not have completed any challenges yet.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
        >
          GO BACK HOME
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">User Profile</h1>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Profile Info */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors"
            >
              <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100 dark:shadow-none">
                <span className="text-4xl font-black text-white">
                  {profile.displayName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{profile.displayName}</h2>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest mb-6">Challenger</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl transition-colors">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{profile.totalPoints}</div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Points</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl transition-colors">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{profile.currentStreak}</div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Streak</div>
                </div>
              </div>
            </motion.div>

            {/* Badges Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
            >
              <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Medal size={16} />
                Badges ({earnedBadges.length})
              </h3>
              {earnedBadges.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium text-center py-4">No badges earned yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.id} className={`${badge.bg} p-3 rounded-2xl flex flex-col items-center text-center gap-2 border border-transparent hover:border-current/10 transition-all`}>
                        <Icon className={badge.color} size={24} />
                        <span className={`text-[10px] font-black uppercase tracking-tight ${badge.color}`}>{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Main Content: History */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
            >
              <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar size={16} />
                Challenge History
              </h3>
              
              {completions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 dark:text-slate-500 font-bold">No challenges completed yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completions.map((completion, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                          <Trophy size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Challenge Mastered</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                            <span>{completion.category}</span>
                            <span>•</span>
                            <span>{format(parseISO(completion.completedAt), 'MMM do, yyyy')}</span>
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
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
