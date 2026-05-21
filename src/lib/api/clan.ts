import { apiFetch, apiFetchWithStatus } from "./fetcher";
import type {
  ClanDetail,
  JoinRequest,
  UserTierInfo,
  CreateClanPayload,
  CreateJoinRequestPayload,
  ApproveRejectPayload,
  LeaderboardEntry,
} from "@/src/types/clan";

const RUST_API = process.env.NEXT_PUBLIC_RUST_ENGINE_URL ?? "http://localhost:8080";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem("yomu_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getClanDetail(clanId: string) {
  return apiFetch<ClanDetail>(`${RUST_API}/api/v1/clans/${clanId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function getUserTier(userId: string) {
  return apiFetch<UserTierInfo>(`${RUST_API}/api/v1/users/${userId}/tier`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function createClan(payload: CreateClanPayload) {
  return apiFetch<ClanDetail>(`${RUST_API}/api/v1/clans`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function createJoinRequest(payload: CreateJoinRequestPayload) {
  return apiFetch<JoinRequest>(
    `${RUST_API}/api/v1/clans/${payload.clan_id}/join-request`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
}

export async function getPendingRequests(clanId: string, callerId: string) {
  const query = `?caller_id=${encodeURIComponent(callerId)}`;
  return apiFetchWithStatus<JoinRequest[]>(
    `${RUST_API}/api/v1/clans/${clanId}/join-requests${query}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
}

export async function approveJoinRequest(
  requestId: string,
  callerId: string,
) {
  const payload: ApproveRejectPayload = { caller_id: callerId };
  return apiFetch<JoinRequest>(
    `${RUST_API}/api/v1/clans/join-requests/${requestId}/approve`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
}

export async function rejectJoinRequest(
  requestId: string,
  callerId: string,
) {
  const payload: ApproveRejectPayload = { caller_id: callerId };
  return apiFetch<JoinRequest>(
    `${RUST_API}/api/v1/clans/join-requests/${requestId}/reject`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteClan(clanId: string, callerId: string) {
  const payload = { caller_id: callerId };
  return apiFetch<never>(`${RUST_API}/api/v1/clans/${clanId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function getLeaderboard() {
  return apiFetch<LeaderboardEntry[]>(`${RUST_API}/api/v1/leaderboards`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}
