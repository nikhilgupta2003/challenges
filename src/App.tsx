import React, { useState, useEffect, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  getDocFromServer,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { Challenge, UserProfile, Completion, ChallengeCategory } from './types';
import StreakDisplay from './components/StreakDisplay';
import ChallengeCard from './components/ChallengeCard';
import ChallengeModal from './components/ChallengeModal';
import HistoryModal from './components/HistoryModal';
import Leaderboard from './components/Leaderboard';
import { LogOut, LogIn, Sparkles, Brain, Code, Puzzle, MessageCircle, Gamepad2, Trophy, Flame, Calendar, TrendingUp, Crown, User, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactConfetti from 'react-confetti';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';

// Mock challenges for demo
const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'apt-1',
    title: 'Numerical Logic',
    description: 'Find the missing number in the sequence: 2, 6, 12, 20, 30, ?',
    category: 'aptitude',
    difficulty: 'easy',
    points: 50,
    content: { question: '2, 6, 12, 20, 30, ?', answer: '42' }
  },
  {
    id: 'apt-2',
    title: 'Percentage Problem',
    description: 'If a price increases by 25%, by what percentage must it decrease to return to the original price?',
    category: 'aptitude',
    difficulty: 'medium',
    points: 60,
    content: { question: 'Decrease % to return to original after 25% increase?', answer: '20' }
  },
  {
    id: 'apt-3',
    title: 'Time and Work',
    description: 'A can do a work in 10 days, B in 15 days. How many days if they work together?',
    category: 'aptitude',
    difficulty: 'medium',
    points: 70,
    content: { question: 'Days for A(10) and B(15) together?', answer: '6' }
  },
  {
    id: 'cod-1',
    title: 'Array Reversal',
    description: 'What is the time complexity of reversing an array of size N in-place?',
    category: 'coding',
    difficulty: 'easy',
    points: 30,
    content: { question: 'Time complexity of in-place array reversal?', answer: 'O(N)' }
  },
  {
    id: 'cod-2',
    title: 'Boolean Logic',
    description: 'What is the result of the expression: true && false || true?',
    category: 'coding',
    difficulty: 'easy',
    points: 30,
    content: { question: 'true && false || true = ?', answer: 'true' }
  },
  {
    id: 'cod-3',
    title: 'String Methods',
    description: 'In JavaScript, which method is used to combine two or more arrays?',
    category: 'coding',
    difficulty: 'easy',
    points: 40,
    content: { question: 'Method to combine arrays?', answer: 'concat' }
  },
  {
    id: 'dsa-1',
    title: 'Binary Tree Height',
    description: 'What is the maximum number of nodes in a binary tree of height H (root at height 0)?',
    category: 'dsa',
    difficulty: 'medium',
    points: 80,
    content: { question: 'Max nodes in binary tree of height H?', answer: '2^(H+1)-1' }
  },
  {
    id: 'dsa-2',
    title: 'Stack Operations',
    description: 'Which data structure uses LIFO (Last In First Out) principle?',
    category: 'dsa',
    difficulty: 'easy',
    points: 40,
    content: { question: 'LIFO data structure?', answer: 'stack' }
  },
  {
    id: 'dsa-3',
    title: 'Sorting Complexity',
    description: 'What is the average time complexity of QuickSort?',
    category: 'dsa',
    difficulty: 'hard',
    points: 90,
    content: { question: 'Avg complexity of QuickSort?', answer: 'O(N log N)' }
  },
  {
    id: 'puz-1',
    title: 'The Heavy Coin',
    description: 'You have 9 identical coins, but one is slightly heavier. What is the minimum number of weighings on a balance scale to find it?',
    category: 'puzzle',
    difficulty: 'medium',
    points: 100,
    content: { question: 'Min weighings for 9 coins?', answer: '2' }
  },
  {
    id: 'puz-2',
    title: 'The Light Switch',
    description: 'There are 3 switches outside a room and 3 bulbs inside. You can enter once. How do you know which switch is for which bulb? (Hint: think about heat)',
    category: 'puzzle',
    difficulty: 'hard',
    points: 120,
    content: { question: 'How to identify switches?', answer: 'heat' }
  },
  {
    id: 'rid-1',
    title: 'The Silent Speaker',
    description: 'What has keys but no locks, space but no room, and allows you to enter but never leave?',
    category: 'riddle',
    difficulty: 'easy',
    points: 40,
    content: { question: 'Keys but no locks...', answer: 'keyboard' }
  },
  {
    id: 'rid-2',
    title: 'The Echo',
    description: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    category: 'riddle',
    difficulty: 'medium',
    points: 50,
    content: { question: 'Speak without mouth...', answer: 'echo' }
  },
  {
    id: 'rid-3',
    title: 'The Map',
    description: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    category: 'riddle',
    difficulty: 'easy',
    points: 60,
    content: { question: 'Cities but no houses...', answer: 'map' }
  },
  {
    id: 'gam-1',
    title: 'Word Scramble',
    description: 'Unscramble the word: "THYOMALGR"',
    category: 'game',
    difficulty: 'medium',
    points: 60,
    content: { question: 'THYOMALGR', answer: 'algorithm' }
  },
  {
    id: 'gam-2',
    title: 'Anagram',
    description: 'Rearrange "LISTEN" to find another common word.',
    category: 'game',
    difficulty: 'easy',
    points: 40,
    content: { question: 'Anagram of LISTEN?', answer: 'silent' }
  },
  {
    id: 'gam-3',
    title: 'Word Scramble II',
    description: 'Unscramble: "PHTYON"',
    category: 'game',
    difficulty: 'easy',
    points: 50,
    content: { question: 'PHTYON', answer: 'python' }
  },
  {
    id: 'rea-1',
    title: 'Logical Deduction',
    description: 'If all A are B, and some B are C, are all A necessarily C?',
    category: 'reasoning',
    difficulty: 'easy',
    points: 50,
    content: { question: 'All A are B, some B are C. All A are C?', answer: 'no' }
  },
  {
    id: 'rea-2',
    title: 'Blood Relations',
    description: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
    category: 'reasoning',
    difficulty: 'medium',
    points: 80,
    content: { question: 'Whose photograph?', answer: 'his son' }
  },
  {
    id: 'rea-3',
    title: 'Direction Sense',
    description: 'A man walks 5km North, then turns right and walks 3km, then turns right and walks 5km. How far is he from the starting point?',
    category: 'reasoning',
    difficulty: 'easy',
    points: 50,
    content: { question: 'Distance from start?', answer: '3km' }
  }
];

function Dashboard({ 
  user, 
  profile, 
  completions, 
  handleLogout, 
  handleCompleteChallenge,
  showHistory,
  setShowHistory,
  showLeaderboard,
  setShowLeaderboard,
  leaderboardUsers,
  activeCategory,
  setActiveCategory,
  activeDifficulty,
  setActiveDifficulty,
  filteredChallenges,
  categories,
  selectedChallenge,
  setSelectedChallenge,
  showConfetti,
  darkMode,
  setDarkMode
}: any) {
  const navigate = useNavigate();
  const Icon = darkMode ? Sparkles : Flame;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      {showConfetti && <ReactConfetti />}
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
              <Flame size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">CHALLENGE QUEST</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl font-bold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
            >
              <Crown size={18} />
              <span>Leaderboard</span>
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
            >
              <TrendingUp size={18} />
              <span>Progress</span>
            </button>
            <Link 
              to={`/profile/${user.uid}`}
              className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.displayName}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">View Profile</span>
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-900/30 dark:group-hover:text-indigo-400 transition-all">
                <User size={20} />
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Progress</h2>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full text-sm">
              <Calendar size={16} />
              <span>{format(new Date(), 'MMMM do, yyyy')}</span>
            </div>
          </div>
          {profile && (
            <StreakDisplay 
              currentStreak={profile.currentStreak}
              longestStreak={profile.longestStreak}
              totalPoints={profile.totalPoints}
              totalCompletions={completions.length}
              onViewHistory={() => setShowHistory(true)}
            />
          )}
        </div>

        {/* Challenges Section */}
        <div>
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daily Challenges</h2>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat: any) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        activeCategory === cat.id 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Icon size={16} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Difficulty:</span>
              <div className="flex items-center gap-2">
                {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setActiveDifficulty(diff)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                      activeDifficulty === diff
                        ? diff === 'easy' ? 'bg-emerald-600 text-white' :
                          diff === 'medium' ? 'bg-amber-600 text-white' :
                          diff === 'hard' ? 'bg-rose-600 text-white' :
                          'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge: any) => (
              <ChallengeCard 
                key={challenge.id}
                challenge={challenge}
                isCompleted={completions.some(c => c.challengeId === challenge.id)}
                onSelect={setSelectedChallenge}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Challenge Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeModal 
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onComplete={handleCompleteChallenge}
          />
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal 
            completions={completions}
            profile={profile}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <Leaderboard 
            users={leaderboardUsers}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState<UserProfile[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | 'all'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setProfile(null);
        setCompletions([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid,
          displayName: auth.currentUser?.displayName || 'User',
          currentStreak: 0,
          longestStreak: 0,
          lastCompletionDate: null,
          totalPoints: 0,
        };
        await setDoc(doc(db, 'users', uid), newProfile);
        
        // Store private data separately
        await setDoc(doc(db, 'private_profiles', uid), {
          email: auth.currentUser?.email || '',
          uid
        });
        
        setProfile(newProfile);
      }

      const completionsQuery = query(collection(db, 'completions'), where('userId', '==', uid));
      const completionsSnap = await getDocs(completionsQuery);
      const completionsData = completionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Completion));
      setCompletions(completionsData);
      
      // Fetch leaderboard
      await fetchLeaderboard();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const leaderboardQuery = query(
        collection(db, 'users'),
        orderBy('totalPoints', 'desc'),
        limit(10)
      );
      const leaderboardSnap = await getDocs(leaderboardQuery);
      const leaderboardData = leaderboardSnap.docs.map(doc => doc.data() as UserProfile);
      setLeaderboardUsers(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCompleteChallenge = async (challenge: Challenge) => {
    if (!user || !profile) return;

    const now = new Date();
    const todayStr = now.toISOString();
    
    // Check if THIS SPECIFIC challenge was already completed EVER
    const challengeAlreadyCompleted = completions.some(c => c.challengeId === challenge.id);

    if (challengeAlreadyCompleted) {
      setSelectedChallenge(null);
      return;
    }
    
    // Check if any challenge was completed today for streak logic
    const alreadyCompletedToday = completions.some(c => isToday(parseISO(c.completedAt)));
    
    let newStreak = profile.currentStreak;
    const lastDate = profile.lastCompletionDate ? parseISO(profile.lastCompletionDate) : null;

    if (!alreadyCompletedToday) {
      if (!lastDate) {
        newStreak = 1;
      } else if (isYesterday(lastDate)) {
        newStreak += 1;
      } else if (!isToday(lastDate)) {
        newStreak = 1;
      }
    }

    const newTotalPoints = profile.totalPoints + challenge.points;
    const newLongestStreak = Math.max(profile.longestStreak, newStreak);

    const completion: Completion = {
      userId: user.uid,
      challengeId: challenge.id,
      category: challenge.category,
      completedAt: todayStr,
      pointsEarned: challenge.points,
    };

    try {
      // Update Firestore first
      await addDoc(collection(db, 'completions'), completion);
      await updateDoc(doc(db, 'users', user.uid), {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCompletionDate: todayStr,
        totalPoints: newTotalPoints,
      });

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCompletionDate: todayStr,
        totalPoints: newTotalPoints,
      } : null);
      
      setCompletions(prev => [...prev, completion]);
      setSelectedChallenge(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      // Refresh leaderboard to show new points
      await fetchLeaderboard();
    } catch (error) {
      console.error("Error completing challenge:", error);
      throw error; // Throw so ChallengeModal can catch it and show error state
    }
  };

  const filteredChallenges = useMemo(() => {
    return DAILY_CHALLENGES.filter(c => {
      const categoryMatch = activeCategory === 'all' || c.category === activeCategory;
      const difficultyMatch = activeDifficulty === 'all' || c.difficulty === activeDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [activeCategory, activeDifficulty]);

  const categories: { id: ChallengeCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'aptitude', label: 'Aptitude', icon: Brain },
    { id: 'coding', label: 'Coding', icon: Code },
    { id: 'dsa', label: 'DSA', icon: Code },
    { id: 'puzzle', label: 'Puzzles', icon: Puzzle },
    { id: 'riddle', label: 'Riddles', icon: MessageCircle },
    { id: 'game', label: 'Games', icon: Gamepad2 },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          !user ? (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-xl border border-slate-100 dark:border-slate-800 text-center transition-colors"
              >
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-100 dark:shadow-none">
                  <Flame size={40} className="text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Level Up Your Streak</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
                  Complete daily challenges in coding, aptitude, and puzzles to build your streak and earn points.
                </p>
                <button
                  onClick={handleLogin}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <LogIn size={24} />
                  SIGN IN WITH GOOGLE
                </button>
              </motion.div>
            </div>
          ) : (
            <Dashboard 
              user={user}
              profile={profile}
              completions={completions}
              handleLogout={handleLogout}
              handleCompleteChallenge={handleCompleteChallenge}
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              showLeaderboard={showLeaderboard}
              setShowLeaderboard={setShowLeaderboard}
              leaderboardUsers={leaderboardUsers}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeDifficulty={activeDifficulty}
              setActiveDifficulty={setActiveDifficulty}
              filteredChallenges={filteredChallenges}
              categories={categories}
              selectedChallenge={selectedChallenge}
              setSelectedChallenge={setSelectedChallenge}
              showConfetti={showConfetti}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )
        } />
        <Route path="/profile/:userId" element={<ProfilePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </BrowserRouter>
  );
}
