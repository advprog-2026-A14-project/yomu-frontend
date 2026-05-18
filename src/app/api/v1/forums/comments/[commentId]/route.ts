import { NextResponse } from "next/server";

import { readAuthHeader } from "@/src/lib/server/authHeaders";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const authHeader = await readAuthHeader();

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await params;
  const body = await request.text();
  const result = await coreFetch(`/api/v1/forums/comments/${encodeURIComponent(commentId)}`, {
    method: "PUT",
    body,
    headers: authHeader,
  });

  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const authHeader = await readAuthHeader();

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await params;
  const result = await coreFetch(`/api/v1/forums/comments/${encodeURIComponent(commentId)}`, {
    method: "DELETE",
    headers: authHeader,
  });

  return NextResponse.json(result.body, { status: result.status });
}
