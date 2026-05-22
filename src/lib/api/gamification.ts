import { getAccessToken } from "./auth";
import { apiFetch, RUST_API_BASE_URL } from "./fetcher";

export type DailyMissionItem = {
  mission_id: string;
  description: string;
  target_count: number;
  current_progress: number;
  is_claimed: boolean;
  reward_points: number;
  mission_type: string;
};

export type DailyMissionsData = {
  missions: DailyMissionItem[];
};

export type UserAchievementItem = {
  achievement_id: string;
  name: string;
  milestone_target: number;
  current_progress: number;
  is_completed: boolean;
  is_shown_on_profile: boolean;
  completed_at: string | null;
  achievement_type: string;
  reward_points: number;
};

export type UserAchievementsData = {
  user_id: string;
  achievements: UserAchievementItem[];
};

export type ToggleProfileVisibilityData = {
  achievement_id: string;
  is_shown_on_profile: boolean;
};

function requireToken() {
  const token = getAccessToken();

  if (!token) {
    return { ok: false as const, message: "Login diperlukan." };
  }

  return { ok: true as const, token };
}

export async function getDailyMissions() {
  const auth = requireToken();

  if (!auth.ok) {
    return { success: false as const, message: auth.message };
  }

  return apiFetch<DailyMissionsData>("/api/v1/missions/daily", {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function claimMission(missionId: string) {
  const auth = requireToken();

  if (!auth.ok) {
    return { success: false as const, message: auth.message };
  }

  return apiFetch<null>(`/api/v1/missions/${missionId}/claim`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function getUserAchievements(userId: string) {
  const auth = requireToken();

  if (!auth.ok) {
    return { success: false as const, message: auth.message };
  }

  return apiFetch<UserAchievementsData>(`/api/v1/achievements/users/${userId}`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function toggleAchievementVisibility(
  userId: string,
  achievementId: string,
  isShown: boolean,
) {
  const auth = requireToken();

  if (!auth.ok) {
    return { success: false as const, message: auth.message };
  }

  return apiFetch<ToggleProfileVisibilityData>(
    `/api/v1/achievements/users/${userId}/${achievementId}/profile-visibility`,
    {
      method: "PATCH",
      baseUrl: RUST_API_BASE_URL,
      token: auth.token,
      body: JSON.stringify({ is_shown_on_profile: isShown }),
    },
  );
}
