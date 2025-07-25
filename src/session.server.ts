import { createCookieSessionStorage } from "react-router";

type SessionData = {
  token?: string;
  sessionCartId?: string;
  userId?: number;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      // all of these are optional
      // domain: "/",
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 días en segundos (604800 segundos)
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: process.env.NODE_ENV === "production", // true en producción, false en desarrollo
    },
  });

export { getSession, commitSession, destroySession };
