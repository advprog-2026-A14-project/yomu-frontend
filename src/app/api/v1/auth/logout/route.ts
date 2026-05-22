import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/src/lib/server/cookies";

<<<<<<< HEAD
=======
const CLIENT_AUTH_COOKIE_NAME = "yomu_client_access_token";

>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
<<<<<<< HEAD
=======
  response.cookies.set(CLIENT_AUTH_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9

  return response;
}
