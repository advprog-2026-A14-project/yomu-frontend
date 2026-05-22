import type { ApiResponse } from "./types";

type ApiFetchOptions = RequestInit & {
  baseUrl?: string;
  token?: string | null;
};

type ApiFetchResult<T> = {
  status: number;
  response: ApiResponse<T>;
};

<<<<<<< HEAD
const defaultApiBaseUrl =
  process.env.NEXT_PUBLIC_YOMU_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export const API_BASE_URL = defaultApiBaseUrl;
=======
const javaApiBaseUrl =
  process.env.NEXT_PUBLIC_YOMU_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export const API_BASE_URL = typeof window === "undefined" ? javaApiBaseUrl : "";
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9

export const RUST_API_BASE_URL =
  process.env.NEXT_PUBLIC_RUST_ENGINE_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

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

function buildApiUrl(path: string, baseUrl: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

<<<<<<< HEAD
=======
function readBrowserToken() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem("yomu_access_token");
  } catch {
    return null;
  }
}

>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
export async function apiFetchWithStatus<T>(
  path: string,
  { baseUrl = API_BASE_URL, token, headers, ...init }: ApiFetchOptions = {},
): Promise<ApiFetchResult<T>> {
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", requestHeaders.get("Accept") ?? "application/json");

  if (typeof init.body === "string" && isJsonString(init.body) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

<<<<<<< HEAD
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
=======
  const authToken = token ?? readBrowserToken();

  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
  }

  try {
    const response = await fetch(buildApiUrl(path, baseUrl), {
      ...init,
      headers: requestHeaders,
      cache: init.cache ?? "no-store",
<<<<<<< HEAD
=======
      credentials: init.credentials ?? "same-origin",
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
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

    if (!isApiResponse<T>(payload)) {
      return {
        status: response.status,
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

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<ApiResponse<T>> {
  const result = await apiFetchWithStatus<T>(path, options);
  return result.response;
}
