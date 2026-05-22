import { getAccessToken } from "./auth";
import { apiFetch, RUST_API_BASE_URL } from "./fetcher";

export type LeaderboardEntry = {
  clan_id: string;
  clan_name: string;
<<<<<<< HEAD
=======
  leader_id: string;
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
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
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Login diperlukan untuk melihat leaderboard" };
  }

  return apiFetch<Leaderboard>(`/api/v1/leaderboards?tier=${encodeURIComponent(tier)}`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token,
  });
}

export async function createClan(name: string, leaderId: string) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Login diperlukan untuk membuat clan" };
  }

  return apiFetch<Clan>("/api/v1/clans", {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token,
    body: JSON.stringify({
      name,
      leader_id: leaderId,
    }),
  });
}

export async function joinClan(clanId: string, userId: string) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Login diperlukan untuk bergabung clan" };
  }

  return apiFetch<{
    clan_id: string;
    user_id: string;
    role: string;
    joined_at: string;
  }>(`/api/v1/clans/${encodeURIComponent(clanId)}/join`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token,
    body: JSON.stringify({
      clan_id: clanId,
      user_id: userId,
    }),
  });
}

export async function getClan(clanId: string) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Login diperlukan untuk melihat clan" };
  }

  return apiFetch<Clan>(`/api/v1/clans/${encodeURIComponent(clanId)}`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token,
  });
}

export async function getUserTier(userId: string) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Login diperlukan untuk melihat tier user" };
  }

  return apiFetch<{
    user_id: string;
    clan_id: string | null;
    clan_name: string | null;
    tier: string | null;
  }>(`/api/v1/users/${userId}/tier`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token,
  });
}
