import { NextResponse } from "next/server";

import { readBearerToken } from "@/src/lib/server/auth";
import { rustFetch } from "@/src/lib/server/rustProxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const authorization = await readBearerToken();

  if (!authorization) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const result = await rustFetch<unknown>(`/api/v1/users/${encodeURIComponent(userId)}/tier`, {
    method: "GET",
    headers: { Authorization: authorization },
  });

  return NextResponse.json(result.body, { status: result.status });
}
