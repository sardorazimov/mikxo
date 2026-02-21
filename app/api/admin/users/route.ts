import { db } from "@/db";
import { users } from "@/db/schema";
import { cookies } from "next/headers";

export async function GET() {
  const adminSession = (await cookies()).get("admin_session")?.value;
  if (adminSession !== "valid") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      isBot: users.isBot,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);

  return Response.json(rows);
}
