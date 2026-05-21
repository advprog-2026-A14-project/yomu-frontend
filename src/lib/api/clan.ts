import { getAccessToken } from "./auth";
import { apiFetch, RUST_API_BASE_URL } from "./fetcher";
import type {
  ClanDetail,
  ClanMembership,
  CreateClanPayload,
  JoinClanPayload,
  LeaderboardDto,
  UserTierInfo,
} from "@/src/types/clan";

function getTokenOrError() {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Login diperlukan untuk mengakses Rust Engine" };
  }

  return { success: true as const, token };
}

export async function getClanDetail(clanId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<ClanDetail>(`/api/v1/clans/${encodeURIComponent(clanId)}`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function getUserTier(userId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<UserTierInfo>(`/api/v1/users/${encodeURIComponent(userId)}/tier`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function createClan(payload: CreateClanPayload) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<ClanDetail>("/api/v1/clans", {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
    body: JSON.stringify(payload),
  });
}

export async function joinClan(payload: JoinClanPayload) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<ClanMembership>(`/api/v1/clans/${encodeURIComponent(payload.clan_id)}/join`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
    body: JSON.stringify(payload),
  });
}

export async function getLeaderboard(tier: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<LeaderboardDto>(`/api/v1/leaderboards?tier=${encodeURIComponent(tier)}`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}
