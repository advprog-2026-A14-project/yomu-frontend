import { apiFetch } from "./fetcher";

export type Tier = "Bronze" | "Silver" | "Gold" | "Diamond" | string;

export type Clan = {
  id: string;
  name: string;
  leader_id: string;
  tier: Tier;
  total_score: number;
  created_at: string;
  members?: ClanMemberSummary[];
  active_buffs?: string[];
  active_debuffs?: string[];
};

export type ClanMember = {
  clan_id: string;
  user_id: string;
  role: "Leader" | "Member" | string;
  joined_at: string;
};

export type ClanMemberSummary = {
  user_id: string;
  role: "Leader" | "Member" | string;
  joined_at: string;
};

export type LeaderboardEntry = {
  clan_id: string;
  clan_name: string;
  total_score: number;
  tier: Tier;
  rank: number;
};

export type Leaderboard = {
  entries: LeaderboardEntry[];
  tier: Tier;
};

export type UserTier = {
  user_id: string;
  clan_id: string | null;
  clan_name: string | null;
  tier: Tier | null;
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

export async function getClan(clanId: string) {
  return apiFetch<Clan>(`/api/v1/clans/${encodeURIComponent(clanId)}`, {
    method: "GET",
  });
}

export async function joinClan(clanId: string, userId: string) {
  return apiFetch<ClanMember>(`/api/v1/clans/${encodeURIComponent(clanId)}/join`, {
    method: "POST",
    body: JSON.stringify({
      clan_id: clanId,
      user_id: userId,
    }),
  });
}

export async function getUserTier(userId: string) {
  return apiFetch<UserTier>(`/api/v1/users/${encodeURIComponent(userId)}/tier`, {
    method: "GET",
  });
}
