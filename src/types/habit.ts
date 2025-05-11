
export interface Habit {
  id: string;
  name: string;
  targetDays: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  startDate: string; // ISO string format
  completedDates: string[]; // Array of ISO string dates
  completionTimestamps: Record<string, string>; // Map of date to ISO timestamp
  streak: number;
  highestStreak: number;
  created_at?: string;
  missedDates?: string[]; // Array of ISO string dates that were missed
}
