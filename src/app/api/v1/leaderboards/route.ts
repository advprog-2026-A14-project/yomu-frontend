import { NextResponse } from "next/server";

import { readAuthHeader } from "@/src/lib/server/authHeaders";
import { rustFetch } from "@/src/lib/server/rustProxy";

export async function GET(request: Request) {
  const authHeader = await readAuthHeader();

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const result = await rustFetch(`/api/v1/leaderboards${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: authHeader,
  });

  return NextResponse.json(result.body, { status: result.status });
}
