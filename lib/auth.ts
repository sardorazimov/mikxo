import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
)
export async function getSession() {
  const sessionCookie = (await cookies()).get("session")?.value; // 'session' isminde sakladığını varsayıyorum
  if (!sessionCookie) return null;

  return await verifySession(sessionCookie);
}

export async function createSession(userId: string) {

  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret)

}

export async function verifySession(token: string) {

  try {

    const { payload } =
      await jwtVerify(token, secret)

    return payload as { userId: string }

  } catch {

    return null

  }

}
