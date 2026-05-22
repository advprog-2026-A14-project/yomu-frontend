import { NextResponse } from "next/server";

<<<<<<< HEAD
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;

  const result = await coreFetch(`/api/v1/articles/${encodeURIComponent(articleId)}`, {
    method: "GET",
=======
import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch(`/api/v1/articles/${encodeURIComponent(articleId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
  });

  return NextResponse.json(result.body, { status: result.status });
}
