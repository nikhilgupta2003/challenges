import React from 'react';
import { Challenge } from '../types';
import { Brain, Code, Puzzle, MessageCircle, Gamepad2, Trophy } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChallengeCardProps {
  key?: React.Key;
  challenge: Challenge;
  isCompleted: boolean;
  onSelect: (challenge: Challenge) => void;
}

const categoryIcons = {
  aptitude: Brain,
  reasoning: Brain,
  coding: Code,
  dsa: Code,
  puzzle: Puzzle,
  riddle: MessageCircle,
  game: Gamepad2,
};

export default function ChallengeCard({ challenge, isCompleted, onSelect }: ChallengeCardProps) {
  const Icon = categoryIcons[challenge.category] || Trophy;

  return (
    <div
      onClick={() => onSelect(challenge)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 cursor-pointer",
        "hover:shadow-xl hover:-translate-y-1",
        isCompleted 
          ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30" 
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-3 rounded-xl",
          isCompleted 
            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
            : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        )}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Trophy size={16} />
          <span>{challenge.points}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
            challenge.difficulty === 'easy' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
            challenge.difficulty === 'medium' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
            "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
          )}>
            {challenge.difficulty}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
            {challenge.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {challenge.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {challenge.description}
        </p>
      </div>

      {isCompleted && (
        <div className="absolute top-0 right-0 p-2">
          <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
