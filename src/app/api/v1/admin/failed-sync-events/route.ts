import { NextResponse } from "next/server";

import { readAuthHeader } from "@/src/lib/server/authHeaders";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET() {
  const authHeader = await readAuthHeader();

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await coreFetch("/api/v1/admin/failed-sync-events", {
    method: "GET",
    headers: authHeader,
  });

  return NextResponse.json(result.body, { status: result.status });
}
