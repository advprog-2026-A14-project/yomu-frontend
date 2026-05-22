import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";

const CLIENT_AUTH_COOKIE_NAME = "yomu_client_access_token";

function readBearerToken(request?: Request) {
  const authorization = request?.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function getAuthToken(request?: Request) {
  const cookieStore = await cookies();
  return (
    cookieStore.get(AUTH_COOKIE_NAME)?.value ??
    cookieStore.get(CLIENT_AUTH_COOKIE_NAME)?.value ??
    readBearerToken(request)
  );
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { success: false, message },
    { status: 401 },
  );
}
