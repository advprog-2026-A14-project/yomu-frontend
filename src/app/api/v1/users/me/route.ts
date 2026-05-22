import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

const CLIENT_AUTH_COOKIE_NAME = "yomu_client_access_token";

export async function GET(request: Request) {
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch("/api/v1/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.body, { status: result.status });
}

export async function PATCH(request: Request) {
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await request.text();

  const result = await coreFetch("/api/v1/users/me", {
    method: "PATCH",
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(request: Request) {
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch("/api/v1/users/me", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = NextResponse.json(result.body, { status: result.status });

  if (result.body.success) {
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
    response.cookies.set(CLIENT_AUTH_COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
