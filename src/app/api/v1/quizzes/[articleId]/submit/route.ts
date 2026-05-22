<<<<<<< HEAD
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";
=======
import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
<<<<<<< HEAD
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
=======
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
  }

  const body = await request.text();

  const result = await coreFetch(`/api/v1/quizzes/${encodeURIComponent(articleId)}/submit`, {
    method: "POST",
    body,
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(result.body, { status: result.status });
}
