import { db } from "@/db";
import { users } from "@/db/schema";
import { hash } from "bcrypt";
import { createSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const passwordHash = await hash(body.password, 10);

  const user = await db
    .insert(users)
    .values({
      username: body.username,
      email: body.email,
      passwordHash,
    })
    .returning();

  const token = await createSession(user[0].id);

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
