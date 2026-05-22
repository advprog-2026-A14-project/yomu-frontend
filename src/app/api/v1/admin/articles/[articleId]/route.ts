import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch(`/api/v1/admin/articles/${encodeURIComponent(articleId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(result.body, { status: result.status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await request.text();

  const result = await coreFetch(`/api/v1/admin/articles/${encodeURIComponent(articleId)}`, {
    method: "PATCH",
    body,
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(result.body, { status: result.status });
}
