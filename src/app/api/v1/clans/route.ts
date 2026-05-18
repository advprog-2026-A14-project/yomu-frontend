import { NextResponse } from "next/server";

import { readBearerToken } from "@/src/lib/server/auth";
import { rustFetch } from "@/src/lib/server/rustProxy";

export async function POST(request: Request) {
  const authorization = await readBearerToken();

  if (!authorization) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text();
  const result = await rustFetch<unknown>("/api/v1/clans", {
    method: "POST",
    body,
    headers: { Authorization: authorization },
  });

  return NextResponse.json(result.body, { status: result.status });
}
