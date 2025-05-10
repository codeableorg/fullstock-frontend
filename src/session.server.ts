import { createCookieSessionStorage } from "react-router";

import { getGuestCartId } from "./services/cart.service";

type SessionData = {
  token: string;
  cartId: string;
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
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

async function addCartToSession() {  // MOVE TO CART
  const cartId = await getGuestCartId();
  const session = await getSession();
  session.set("cartId", cartId);
  return commitSession(session);
}

async function getCardIdFromSession() {
  const session = await getSession();
  return session.get("cartId");
}

export {
  getSession,
  commitSession,
  destroySession,
  addCartToSession,
  getCardIdFromSession,
};

