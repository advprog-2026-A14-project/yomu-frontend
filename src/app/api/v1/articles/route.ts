import { NextResponse } from "next/server";

<<<<<<< HEAD
=======
import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
<<<<<<< HEAD

  const result = await coreFetch(`/api/v1/articles${query}`, {
    method: "GET",
=======
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch(`/api/v1/articles${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
  });

  return NextResponse.json(result.body, { status: result.status });
}
