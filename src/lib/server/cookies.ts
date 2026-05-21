import "server-only";

const cookieName = process.env.AUTH_COOKIE_NAME?.trim();

export const AUTH_COOKIE_NAME =
  cookieName && cookieName.length > 0 ? cookieName : "yomu_access_token";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.AUTH_COOKIE_SECURE === "true",
};
