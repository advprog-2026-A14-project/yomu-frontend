import { NextResponse } from "next/server";

import { readAuthHeader } from "@/src/lib/server/authHeaders";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function POST(request: Request) {
  const authHeader = await readAuthHeader();

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text();
  const result = await coreFetch("/api/v1/admin/failed-sync-events/retry", {
    method: "POST",
    body,
    headers: authHeader,
  });

  return NextResponse.json(result.body, { status: result.status });
}
