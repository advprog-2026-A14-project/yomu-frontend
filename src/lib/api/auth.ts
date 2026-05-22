import { apiFetch, apiFetchWithStatus } from "./fetcher";
import type { ApiResponse } from "./types";

export type Role = "PELAJAR" | "ADMIN" | string;

export type User = {
  user_id: string;
  username: string;
  display_name: string;
  email?: string | null;
  phone_number?: string | null;
  role: Role;
};

type AuthData = {
  access_token: string;
  user: User;
};

type GoogleAuthData = {
  is_new_user: boolean;
  access_token: string;
  user: User;
};

export type RegisterPayload = {
  username: string;
  display_name: string;
  password: string;
  email?: string;
  phone_number?: string;
};

export type MeResult = {
  status: number;
  response: ApiResponse<User>;
};

const ACCESS_TOKEN_KEY = "yomu_access_token";
const USER_KEY = "yomu_user";
const CLIENT_COOKIE_NAME = "yomu_client_access_token";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function storeAuthSession(data: AuthData | GoogleAuthData) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  document.cookie = `${CLIENT_COOKIE_NAME}=${encodeURIComponent(data.access_token)}; path=/; SameSite=Lax`;
  // also store in sessionStorage for Rust API access
  try { window.sessionStorage.setItem("yomu_access_token", data.access_token); } catch { /* noop */ }
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  document.cookie = `${CLIENT_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    document.cookie = `${CLIENT_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  }

  return token;
}

export function getStoredUser(): User | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export async function login(identifier: string, password: string) {
  const res = await apiFetch<AuthData>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  if (res.success && "data" in res && res.data) {
    storeAuthSession(res.data);
  }

  return res;
}

export async function register(payload: RegisterPayload) {
  const res = await apiFetch<AuthData>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.success && "data" in res && res.data) {
    storeAuthSession(res.data);
  }

  return res;
}

export async function googleLogin(idToken: string) {
  const res = await apiFetch<GoogleAuthData>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({
      id_token: idToken,
    }),
  });

  if (res.success && "data" in res && res.data) {
    storeAuthSession(res.data);
  }

  return res;
}

export async function me(): Promise<MeResult> {
  const token = getAccessToken();

  if (!token) {
    return {
      status: 401,
      response: { success: false, message: "Session tidak ditemukan" },
    };
  }

  const result = await apiFetchWithStatus<User>("/api/v1/users/me", {
    method: "GET",
    token,
  });

  if (result.status === 401 || result.status === 403) {
    clearAuthSession();
  }

  if (result.response.success && "data" in result.response && result.response.data && canUseStorage()) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(result.response.data));
  }

  return result;
}

export async function logout() {
  try {
    await apiFetch<never>("/api/v1/auth/logout", {
      method: "POST",
    });
  } catch {
    // Local cleanup is the source of truth for the browser session.
  }
  clearAuthSession();
  try { window.sessionStorage.removeItem("yomu_access_token"); } catch { /* noop */ }
  return { success: true, message: "Logout berhasil" } satisfies ApiResponse<never>;
}

// sessionStorage helpers for Rust API (CSR direct calls)
export function storeAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("yomu_access_token", token);
  }
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("yomu_access_token") ?? getAccessToken();
}

export async function getCurrentUserId(): Promise<string | null> {
  const result = await me();
  if (result.response.success && "data" in result.response && result.response.data) {
    return result.response.data.user_id;
  }
  return null;
}

export async function updateProfile(payload: { username?: string; display_name?: string }) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Session tidak ditemukan" };
  }

  const response = await apiFetch<User>("/api/v1/users/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  if (response.success && "data" in response && response.data && canUseStorage()) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(response.data));
  }

  return response;
}

export async function updatePassword(payload: { current_password?: string; new_password: string }) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Session tidak ditemukan" };
  }

  return apiFetch<never>("/api/v1/users/me/password", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateLoginIdentifiers(payload: { email?: string; phone_number?: string }) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Session tidak ditemukan" };
  }

  const response = await apiFetch<User>("/api/v1/users/me/login-identifiers", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  if (response.success && "data" in response && response.data && canUseStorage()) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(response.data));
  }

  return response;
}

export async function deleteAccount() {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Session tidak ditemukan" };
  }

  const response = await apiFetch<never>("/api/v1/users/me", {
    method: "DELETE",
    token,
  });

  if (response.success) {
    clearAuthSession();
  }

  return response;
}

export type PublicUser = {
  user_id: string;
  display_name: string;
  username: string;
};

export async function getBatchUsers(userIds: string[]): Promise<PublicUser[]> {
  if (userIds.length === 0) return [];

  const token = getAccessToken();

  if (!token) {
    return [];
  }

  const idsParam = userIds.join(",");
  const response = await apiFetch<PublicUser[]>(`/api/v1/users/batch?ids=${idsParam}`, {
    method: "GET",
    token,
  });

  if (response.success && "data" in response && response.data) {
    return response.data;
  }

  return [];
}
