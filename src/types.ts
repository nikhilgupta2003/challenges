export type ChallengeCategory = 'aptitude' | 'reasoning' | 'coding' | 'dsa' | 'puzzle' | 'riddle' | 'game';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  content: any; // Specific to the challenge type
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null; // ISO string
  totalPoints: number;
}

export interface Completion {
  id?: string;
  userId: string;
  challengeId: string;
  category: ChallengeCategory;
  completedAt: string;
  pointsEarned: number;
}
