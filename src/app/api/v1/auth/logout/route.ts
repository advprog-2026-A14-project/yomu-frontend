import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/src/lib/server/cookies";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}
