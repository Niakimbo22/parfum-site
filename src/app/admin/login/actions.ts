"use server";

import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function loginAction(password: string) {
  if (typeof password !== "string" || !password) {
    return { error: "Mot de passe invalide." };
  }

  // Hashes stored as base64 in .env.local to avoid dotenv $ expansion
  const nicoHash = Buffer.from(process.env.ADMIN_HASH_NICO ?? "", "base64").toString("utf8");
  const lucaHash = Buffer.from(process.env.ADMIN_HASH_LUCA ?? "", "base64").toString("utf8");
  const secret = process.env.SESSION_SECRET ?? "";

  if (!nicoHash || !lucaHash || secret.length < 32) {
    return { error: "Erreur de configuration serveur." };
  }

  let adminName: string | null = null;
  try {
    if (await bcrypt.compare(password, nicoHash)) adminName = "Nico";
    else if (await bcrypt.compare(password, lucaHash)) adminName = "Luca";
  } catch {
    return { error: "Erreur d'authentification." };
  }

  if (!adminName) {
    return { error: "Code d'accès incorrect." };
  }

  try {
    const key = new TextEncoder().encode(secret);
    const now = Math.floor(Date.now() / 1000);
    const expires = new Date((now + 86400) * 1000);
    const token = await new SignJWT({ adminName })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(now + 86400)
      .sign(key);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
    });
  } catch {
    return { error: "Erreur lors de la création de session." };
  }

  return { success: true };
}
