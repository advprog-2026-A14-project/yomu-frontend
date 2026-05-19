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

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function storeAuthSession(data: AuthData | GoogleAuthData) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
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
  const response = await apiFetch<AuthData>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  if (response.success && "data" in response && response.data) {
    storeAuthSession(response.data);
  }

  return response;
}

export async function register(payload: RegisterPayload) {
  const response = await apiFetch<AuthData>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.success && "data" in response && response.data) {
    storeAuthSession(response.data);
  }

  return response;
}

export async function googleLogin(idToken: string) {
  const response = await apiFetch<GoogleAuthData>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({
      id_token: idToken,
    }),
  });

  if (response.success && "data" in response && response.data) {
    storeAuthSession(response.data);
  }

  return response;
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
  clearAuthSession();
  return { success: true, message: "Logout berhasil" } satisfies ApiResponse<never>;
}
