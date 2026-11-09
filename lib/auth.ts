import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { AuthUser } from "@/types";

const SESSION_SECRET =
  process.env.AUTH_SECRET || "devflow-local-secret-key-2026-hmac";

export const SESSION_COOKIE_NAME = "devflow_session";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const hashBuffer = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (hashBuffer.length !== keyBuffer.length) return false;
  return timingSafeEqual(hashBuffer, keyBuffer);
}

interface SessionPayload extends AuthUser {
  exp: number;
}

export function signSessionToken(user: AuthUser): string {
  const payload: SessionPayload = {
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): AuthUser | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSig = createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    ) as SessionPayload;

    if (Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

