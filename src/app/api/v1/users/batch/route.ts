import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
=======
import { getAuthToken, unauthorizedResponse } from "@/src/lib/server/auth";
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json(
      { success: false, message: "Parameter 'ids' diperlukan" },
      { status: 400 }
    );
  }

  const ids = idsParam.split(",").filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json(
      { success: false, message: "Minimal satu user ID diperlukan" },
      { status: 400 }
    );
  }

  if (ids.length > 100) {
    return NextResponse.json(
      { success: false, message: "Maksimal 100 user ID per request" },
      { status: 400 }
    );
  }

<<<<<<< HEAD
  const result = await coreFetch<Array<{ user_id: string; display_name: string; username: string }>>(
    `/api/v1/users/batch?ids=${ids.join(",")}`,
    { cache: "no-store" }
=======
  const token = await getAuthToken(request);

  if (!token) {
    return unauthorizedResponse();
  }

  const result = await coreFetch<Array<{ user_id: string; display_name: string; username: string }>>(
    `/api/v1/users/batch?ids=${ids.join(",")}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
  );

  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.body);
<<<<<<< HEAD
}
=======
}
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
