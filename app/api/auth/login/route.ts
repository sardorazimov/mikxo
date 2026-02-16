import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";
import { createSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const user = await db.query.users.findFirst({
    where: eq(users.username, body.username),
  });

  if (!user || !user.passwordHash)
    return new Response("Invalid credentials", { status: 401 });

  const valid = await compare(body.password, user.passwordHash);

  if (!valid) return new Response("Invalid credentials", { status: 401 });

  const token = await createSession(user.id);

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({
    ok: true,
  });
}
