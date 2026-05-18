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

const DEFAULT_TIMEOUT_MS = 5000;

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

function describeInvalidPayload(status: number, payload: unknown) {
  if (typeof payload === "string") {
    return `Upstream response invalid (${status}): ${payload.slice(0, 160)}`;
  }

  try {
    return `Upstream response invalid (${status}): ${JSON.stringify(payload).slice(0, 160)}`;
  } catch {
    return `Upstream response invalid (${status})`;
  }
}

export async function rustFetch<T>(path: string, init: RequestInit = {}): Promise<RustFetchResult<T>> {
  const baseUrl = process.env.RUST_ENGINE_BASE_URL?.trim() || "http://localhost:8080";
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
      signal: init.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
  } catch (error) {
    return {
      ok: false,
      status: 502,
      body: {
        success: false,
        message: error instanceof Error ? `Rust Engine tidak dapat dihubungi: ${error.message}` : "Rust Engine tidak dapat dihubungi",
      },
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
      body: { success: false, message: describeInvalidPayload(response.status, payload) },
    };
  }

  return {
    ok: true,
    status: response.status,
    body: payload,
  };
}
