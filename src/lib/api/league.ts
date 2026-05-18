import { apiFetch } from "./fetcher";

export type LeaderboardEntry = {
  clan_id: string;
  clan_name: string;
  total_score: number;
  tier: string;
  rank: number;
};

export type Leaderboard = {
  entries: LeaderboardEntry[];
  tier: string;
};

export type Clan = {
  id: string;
  name: string;
  leader_id: string;
  tier: string;
  total_score: number;
  created_at: string;
  members?: Array<{
    user_id: string;
    role: string;
    joined_at: string;
  }>;
};

export async function getLeaderboard(tier = "Bronze") {
  return apiFetch<Leaderboard>(`/api/v1/leaderboards?tier=${encodeURIComponent(tier)}`, {
    method: "GET",
  });
}

export async function createClan(name: string, leaderId: string) {
  return apiFetch<Clan>("/api/v1/clans", {
    method: "POST",
    body: JSON.stringify({
      name,
      leader_id: leaderId,
    }),
  });
}

export async function getUserTier(userId: string) {
  return apiFetch<{
    user_id: string;
    clan_id: string | null;
    clan_name: string | null;
    tier: string | null;
  }>(`/api/v1/users/${userId}/tier`, {
    method: "GET",
  });
}
