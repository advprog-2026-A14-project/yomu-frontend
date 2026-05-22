import "server-only";

import type { User } from "@/src/lib/api/auth";
import type { ApiResponse } from "@/src/lib/api/types";
import { getAuthToken } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const token = await getAuthToken();

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
