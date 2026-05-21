import { NextResponse } from "next/server";

import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = category ? `?category=${encodeURIComponent(category)}` : "";

  const result = await coreFetch(`/api/v1/articles${query}`, {
    method: "GET",
  });

  return NextResponse.json(result.body, { status: result.status });
}
