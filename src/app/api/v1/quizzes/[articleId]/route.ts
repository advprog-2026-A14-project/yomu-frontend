import { NextResponse } from "next/server";

import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const result = await coreFetch(`/api/v1/quizzes/${encodeURIComponent(articleId)}`, {
    method: "GET",
  });

  return NextResponse.json(result.body, { status: result.status });
}
