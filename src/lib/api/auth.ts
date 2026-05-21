import { apiFetch, isApiResponse } from "./fetcher";
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

export async function login(identifier: string, password: string) {
  const res = await apiFetch<AuthData>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier,
      password,
    }),
  });
  if (res.success && "data" in res && res.data?.access_token) {
    storeAuthToken(res.data.access_token);
  }
  return res;
}

export async function register(payload: RegisterPayload) {
  const res = await apiFetch<AuthData>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res.success && "data" in res && res.data?.access_token) {
    storeAuthToken(res.data.access_token);
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
  if (res.success && "data" in res && res.data?.access_token) {
    storeAuthToken(res.data.access_token);
  }
  return res;
}

export async function me(): Promise<MeResult> {
  try {
    const response = await fetch("/api/v1/users/me", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      return {
        status: response.status,
        response: { success: false, message: "Terjadi kesalahan jaringan" },
      };
    }

    if (!isApiResponse<User>(payload)) {
      return {
        status: 502,
        response: { success: false, message: "Upstream response invalid" },
      };
    }

    return {
      status: response.status,
      response: payload,
    };
  } catch {
    return {
      status: 0,
      response: { success: false, message: "Terjadi kesalahan jaringan" },
    };
  }
}

export async function logout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("yomu_access_token");
  }
  return apiFetch<never>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export function storeAuthToken(token: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("yomu_access_token", token);
  }
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("yomu_access_token");
}

export async function getCurrentUserId(): Promise<string | null> {
  const result = await me();
  if (result.response.success && "data" in result.response && result.response.data) {
    return result.response.data.user_id;
  }
  return null;
}
