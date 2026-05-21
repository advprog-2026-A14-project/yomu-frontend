import "server-only";

import type { ApiResponse } from "@/src/lib/api/types";

type CoreFetchSuccess<T> = {
  ok: true;
  status: number;
  body: ApiResponse<T>;
};

type CoreFetchFailure = {
  ok: false;
  status: number;
  body: ApiResponse<never>;
};

export type CoreFetchResult<T> = CoreFetchSuccess<T> | CoreFetchFailure;

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

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    success?: unknown;
    message?: unknown;
  };

  if (typeof candidate.success !== "boolean") {
    return false;
  }

  if (typeof candidate.message !== "string") {
    return false;
  }

  return true;
}

export async function coreFetch<T>(path: string, init: RequestInit = {}): Promise<CoreFetchResult<T>> {
  const baseUrl = process.env.CORE_API_BASE_URL;

  if (!baseUrl) {
    return {
      ok: false,
      status: 500,
      body: { success: false, message: "CORE_API_BASE_URL belum diatur" },
    };
  }

  const headers = new Headers(init.headers);

  if (typeof init.body === "string" && isJsonString(init.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      status: 502,
      body: { success: false, message: "Upstream response invalid" },
    };
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    return {
      ok: false,
      status: 502,
      body: { success: false, message: "Upstream response invalid" },
    };
  }

  if (!isApiResponse<T>(payload)) {
    return {
      ok: false,
      status: 502,
      body: { success: false, message: "Upstream response invalid" },
    };
  }

  return {
    ok: true,
    status: response.status,
    body: payload,
  };
}
