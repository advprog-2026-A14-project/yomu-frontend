import "server-only";

import { cookies } from "next/headers";

import type { User } from "@/src/lib/api/auth";
import type { ApiResponse } from "@/src/lib/api/types";
import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const result = await coreFetch<User>("/api/v1/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return result.body;
}
