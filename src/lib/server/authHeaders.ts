import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";

export async function readAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return { Authorization: `Bearer ${token}` };
}
