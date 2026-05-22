/* 📝 TYPESCRIPT - Clan & League type definitions */

export type ClanTier = "Bronze" | "Silver" | "Gold" | "Diamond";

export type JoinRequestStatus = "pending" | "approved" | "rejected";

export interface ClanMember {
  user_id: string;
  role: "Leader" | "Member";
  joined_at: string;
}

export interface BuffInfo {
  name: string;
  multiplier: number;
  expires_at: string;
}

export interface DebuffInfo {
  name: string;
  multiplier: number;
  expires_at: string;
}

export interface ClanDetail {
  id: string;
  name: string;
  leader_id: string;
  tier: ClanTier;
  total_score: number;
  created_at: string;
  members: ClanMember[];
  active_buffs: BuffInfo[];
  active_debuffs: DebuffInfo[];
}

export interface JoinRequest {
  id: string;
  clan_id: string;
  user_id: string;
  status: JoinRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface UserTierInfo {
  user_id: string;
  clan_id: string | null;
  clan_name: string | null;
  tier: ClanTier | null;
}

export interface CreateClanPayload {
  name: string;
  leader_id: string;
}

export interface JoinClanPayload {
  clan_id: string;
  user_id: string;
}

export interface CreateJoinRequestPayload {
  clan_id: string;
  user_id: string;
}

export interface ApproveRejectPayload {
  caller_id: string;
}

export interface DeleteClanPayload {
  caller_id: string;
}

export interface LeaderboardEntry {
  clan_id: string;
  clan_name: string;
  tier: string;
  total_score: number;
  rank: number;
}

export interface LeaderboardDto {
  tier: string;
  entries: LeaderboardEntry[];
}

export interface UserTierResponse {
  user_id: string;
  clan_id: string | null;
  clan_name: string | null;
  tier: ClanTier | null;
}
