import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {

  const token =
    (await cookies()).get("session")?.value;

  if (!token)
    return null;

  const session =
    await verifySession(token);

  if (!session)
    return null;

  const user =
    await db.query.users.findFirst({

      where: eq(
        users.id,
        session.userId
      )

    });

  return user;

}
