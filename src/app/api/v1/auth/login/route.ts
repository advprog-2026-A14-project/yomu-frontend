import { NextResponse } from "next/server";

import type { ApiResponse } from "@/src/lib/api/types";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

function readAccessToken(payload: ApiResponse<unknown>): string | null {
  if (!payload.success || !("data" in payload) || !payload.data || typeof payload.data !== "object") {
    return null;
  }

  const token = (payload.data as { access_token?: unknown }).access_token;
  return typeof token === "string" ? token : null;
}

export async function POST(request: Request) {
  const body = await request.text();

  const result = await coreFetch("/api/v1/auth/login", {
    method: "POST",
    body,
  });

  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  const response = NextResponse.json(result.body, { status: result.status });
  const accessToken = readAccessToken(result.body);

  if (result.body.success && accessToken) {
    response.cookies.set(AUTH_COOKIE_NAME, accessToken, AUTH_COOKIE_OPTIONS);
  }

  return response;
}
