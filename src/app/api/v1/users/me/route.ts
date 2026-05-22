<<<<<<< HEAD
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
=======
import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

const CLIENT_AUTH_COOKIE_NAME = "yomu_client_access_token";

export async function GET(request: Request) {
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
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
<<<<<<< HEAD
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
=======
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
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

<<<<<<< HEAD
export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
=======
export async function DELETE(request: Request) {
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
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
<<<<<<< HEAD
=======
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
    response.cookies.set(CLIENT_AUTH_COOKIE_NAME, "", {
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
