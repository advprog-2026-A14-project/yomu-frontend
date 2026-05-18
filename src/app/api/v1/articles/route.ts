import { NextResponse } from "next/server";

import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const result = await coreFetch(`/api/v1/articles${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  return NextResponse.json(result.body, { status: result.status });
}
