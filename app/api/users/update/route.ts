import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function POST(req: Request) {

  const token =
    (await cookies()).get("session")?.value;

  if (!token)
    return new Response(
      "Unauthorized",
      { status: 401 }
    );

  const session =
    await verifySession(token);

  if (!session)
    return new Response(
      "Unauthorized",
      { status: 401 }
    );

  const body =
    await req.json();

  await db
    .update(users)
    .set({

      username: body.username,

      bio: body.bio,

    })
    .where(
      eq(
        users.id,
        session.userId
      )
    );

  return Response.json({
    ok: true
  });

}
