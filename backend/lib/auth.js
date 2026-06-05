import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "owner_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.OWNER_SESSION_SECRET;
  if (!secret) {
    throw new Error("OWNER_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createOwnerSession() {
  return new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyOwnerSession(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "owner";
  } catch {
    return false;
  }
}

export function verifyOwnerPassword(password) {
  const expected = process.env.OWNER_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function isOwnerAuthenticated(req) {
  const token = req.cookies?.[COOKIE_NAME];
  return verifyOwnerSession(token);
}
