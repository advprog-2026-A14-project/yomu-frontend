import { NextResponse } from "next/server";

import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await coreFetch<unknown>(`/api/v1/articles/${encodeURIComponent(id)}`, {
    method: "GET",
  });

  return NextResponse.json(result.body, { status: result.status });
}
