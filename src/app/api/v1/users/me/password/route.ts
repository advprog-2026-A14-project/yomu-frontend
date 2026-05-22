import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function PATCH(request: Request) {
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
  }

  const body = await request.text();

  const result = await coreFetch("/api/v1/users/me/password", {
    method: "PATCH",
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(result.body, { status: result.status });
}
