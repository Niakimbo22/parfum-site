import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type AdminName = "Nico" | "Luca";

export interface SessionPayload {
  adminName: AdminName;
  iat?: number;
  absExp?: number;
}

const SESSION_COOKIE = "session";

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET manquant ou trop court.");
  }
  return new TextEncoder().encode(secret);
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    const name = payload.adminName as string;
    if (name !== "Nico" && name !== "Luca") return null;
    return { adminName: name as AdminName };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function logout() {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    const name = payload.adminName as string;
    if (name !== "Nico" && name !== "Luca") return null;
    return { adminName: name as AdminName };
  } catch {
    return null;
  }
}

// Kept for middleware session refresh
export async function updateSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return;
  try {
    await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
  } catch {
    return;
  }
  return NextResponse.next();
}
