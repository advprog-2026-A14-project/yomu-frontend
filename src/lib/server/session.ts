import "server-only";

<<<<<<< HEAD
import { cookies } from "next/headers";

import type { User } from "@/src/lib/api/auth";
import type { ApiResponse } from "@/src/lib/api/types";
import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
=======
import type { User } from "@/src/lib/api/auth";
import type { ApiResponse } from "@/src/lib/api/types";
import { getAuthToken } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const token = await getAuthToken();
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9

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
