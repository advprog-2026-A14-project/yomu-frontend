import "server-only";

import type { ApiResponse } from "@/src/lib/api/types";

type RustFetchSuccess<T> = {
  ok: true;
  status: number;
  body: ApiResponse<T>;
};

type RustFetchFailure = {
  ok: false;
  status: number;
  body: ApiResponse<never>;
};

export type RustFetchResult<T> = RustFetchSuccess<T> | RustFetchFailure;

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

  return typeof candidate.success === "boolean" && typeof candidate.message === "string";
}

export async function rustFetch<T>(path: string, init: RequestInit = {}): Promise<RustFetchResult<T>> {
  const baseUrl = process.env.RUST_ENGINE_BASE_URL;

  if (!baseUrl) {
    return {
      ok: false,
      status: 500,
      body: { success: false, message: "RUST_ENGINE_BASE_URL belum diatur" },
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
      body: { success: false, message: "Rust upstream response invalid" },
    };
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    return {
      ok: false,
      status: 502,
      body: { success: false, message: "Rust upstream response invalid" },
    };
  }

  if (!isApiResponse<T>(payload)) {
    return {
      ok: false,
      status: 502,
      body: { success: false, message: "Rust upstream response invalid" },
    };
  }

  return {
    ok: true,
    status: response.status,
    body: payload,
  };
}
