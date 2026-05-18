import { NextResponse } from "next/server";

import { coreFetch } from "@/src/lib/server/coreProxy";
import { readBearerToken } from "@/src/lib/server/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const authorization = await readBearerToken();

  if (!authorization) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { articleId } = await params;
  const body = await request.text();
  const result = await coreFetch<unknown>(
    `/api/v1/quizzes/${encodeURIComponent(articleId)}/submit`,
    {
      method: "POST",
      body,
      headers: { Authorization: authorization },
    },
  );

  return NextResponse.json(result.body, { status: result.status });
}
