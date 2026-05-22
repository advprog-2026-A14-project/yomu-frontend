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

export async function createJoinRequest(clanId: string, userId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/clans/${encodeURIComponent(clanId)}/join-request`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
    body: JSON.stringify({ clan_id: clanId, user_id: userId }),
  });
}

export async function joinClan(payload: JoinClanPayload) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  // DEPRECATED: direct join is disabled. Use createJoinRequest() instead.
  // Kept for backwards-compatibility in case other callers depend on it.
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

export async function triggerSeasonEnd(seasonId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/seasons/${encodeURIComponent(seasonId)}/end`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function processBuffs(clanId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/clans/${encodeURIComponent(clanId)}/process-buffs`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function getAllClans() {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<ClanDetail[]>("/api/v1/clans", {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function getPendingRequests(clanId: string, callerId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/clans/${encodeURIComponent(clanId)}/join-requests?caller_id=${encodeURIComponent(callerId)}`, {
    method: "GET",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
  });
}

export async function approveJoinRequest(requestId: string, callerId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/clans/join-requests/${encodeURIComponent(requestId)}/approve`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
    body: JSON.stringify({ caller_id: callerId }),
  });
}

export async function rejectJoinRequest(requestId: string, callerId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/clans/join-requests/${encodeURIComponent(requestId)}/reject`, {
    method: "POST",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
    body: JSON.stringify({ caller_id: callerId }),
  });
}

export async function deleteClan(clanId: string, callerId: string) {
  const auth = getTokenOrError();

  if (!auth.success) {
    return auth;
  }

  return apiFetch<unknown>(`/api/v1/clans/${encodeURIComponent(clanId)}`, {
    method: "DELETE",
    baseUrl: RUST_API_BASE_URL,
    token: auth.token,
    body: JSON.stringify({ caller_id: callerId }),
  });
}