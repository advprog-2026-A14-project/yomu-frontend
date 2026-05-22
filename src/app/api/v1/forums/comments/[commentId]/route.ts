<<<<<<< HEAD
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/src/lib/server/cookies";
import { coreFetch } from "@/src/lib/server/coreProxy";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}

=======
import { NextResponse } from "next/server";

import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
<<<<<<< HEAD
  const token = await getAuthToken();
=======
  const token = await getAuthToken(request);
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await request.text();

<<<<<<< HEAD
  const result = await coreFetch(`/api/v1/forums/comments/${commentId}`, {
=======
  const result = await coreFetch(`/api/v1/forums/comments/${encodeURIComponent(commentId)}`, {
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
    method: "PUT",
    body,
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
<<<<<<< HEAD
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const token = await getAuthToken();
=======
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  const token = await getAuthToken(request);
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9

  if (!token) {
    return unauthorizedResponse();
  }

<<<<<<< HEAD
  const result = await coreFetch(`/api/v1/forums/comments/${commentId}`, {
=======
  const result = await coreFetch(`/api/v1/forums/comments/${encodeURIComponent(commentId)}`, {
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(result.body, { status: result.status });
}
