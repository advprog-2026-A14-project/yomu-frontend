import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await request.text();

  const result = await coreFetch(
    `/api/v1/forums/comments/${encodeURIComponent(commentId)}/reactions`,
    {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return NextResponse.json(result.body, { status: result.status });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch(
    `/api/v1/forums/comments/${encodeURIComponent(commentId)}/reactions`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return NextResponse.json(result.body, { status: result.status });
}
