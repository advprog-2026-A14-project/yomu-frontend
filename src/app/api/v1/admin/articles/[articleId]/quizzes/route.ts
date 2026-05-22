import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await request.text();

  const result = await coreFetch(`/api/v1/admin/articles/${encodeURIComponent(articleId)}/quizzes`, {
    method: "POST",
    body,
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(result.body, { status: result.status });
}
