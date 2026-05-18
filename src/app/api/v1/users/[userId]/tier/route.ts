import { NextResponse } from "next/server";

import { readAuthHeader } from "@/src/lib/server/authHeaders";
import { rustFetch } from "@/src/lib/server/rustProxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const authHeader = await readAuthHeader();

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const result = await rustFetch(`/api/v1/users/${encodeURIComponent(userId)}/tier`, {
    method: "GET",
    headers: authHeader,
  });

  return NextResponse.json(result.body, { status: result.status });
}
