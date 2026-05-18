import { NextResponse } from "next/server";

import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  const result = await coreFetch<unknown[]>(`/api/v1/articles${search}`, {
    method: "GET",
  });

  return NextResponse.json(result.body, { status: result.status });
}
