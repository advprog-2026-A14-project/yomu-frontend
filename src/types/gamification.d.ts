export type MissionType = "ReadArticle" | "Quiz" | "DailyLogin";

export type AchievementType = "Common" | "Rare" | "Epic" | "Legendary";

export type TriggerType = "QuizComplete" | "ReadArticle" | "DailyLogin";

export interface DailyMissionItem {
  mission_id: string;
  description: string;
  target_count: number;
  current_progress: number;
  is_claimed: boolean;
  reward_points: number;
  mission_type: MissionType;
}

export interface UserAchievementItem {
  achievement_id: string;
  name: string;
  milestone_target: number;
  current_progress: number;
  is_completed: boolean;
  is_shown_on_profile: boolean;
  completed_at: string | null;
  achievement_type: AchievementType;
  trigger_type: TriggerType;
  reward_points: number;
}

export interface CreateAchievementPayload {
  name: string;
  milestone_target: number;
  achievement_type: AchievementType;
  trigger_type: TriggerType;
  reward_points: number;
}

export interface CreateMissionPayload {
  description: string;
  target_count: number;
  date: string;
  reward_points: number;
  mission_type: MissionType;
}
