import type { ApiResponse } from "./types";

function isJsonString(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    success?: unknown;
    message?: unknown;
  };

  if (typeof candidate.success !== "boolean" || typeof candidate.message !== "string") {
    return false;
  }

  return true;
}

export async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);

  if (typeof init.body === "string" && isJsonString(init.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers,
      credentials: init.credentials ?? "same-origin",
      cache: init.cache ?? "no-store",
    });

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      return { success: false, message: "Terjadi kesalahan jaringan" };
    }

    if (!isApiResponse<T>(payload)) {
      return { success: false, message: "Upstream response invalid" };
    }

    return payload;
  } catch {
    return { success: false, message: "Terjadi kesalahan jaringan" };
  }
}
