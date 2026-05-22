/* 📝 TYPESCRIPT - Gamification type definitions */

export type MissionStatus = "active" | "completed" | "expired";

export interface Mission {
  id: string;
  name: string;
  description: string;
  xp_reward: number;
  status: MissionStatus;
  deadline: string | null;
  progress: number;
  target: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at: string | null;
  xp_reward: number;
}

export interface DailyReward {
  day: number;
  claimed: boolean;
  xp_reward: number;
  item_name: string | null;
}
