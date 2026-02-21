import { db } from "@/db";
import { users, groups, channels, messages } from "@/db/schema";
import { cookies } from "next/headers";
import { count } from "drizzle-orm";

export async function GET() {
  const adminSession = (await cookies()).get("admin_session")?.value;
  if (adminSession !== "valid") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [[{ userCount }], [{ groupCount }], [{ channelCount }], [{ messageCount }]] =
    await Promise.all([
      db.select({ userCount: count() }).from(users),
      db.select({ groupCount: count() }).from(groups),
      db.select({ channelCount: count() }).from(channels),
      db.select({ messageCount: count() }).from(messages),
    ]);

  return Response.json({ userCount, groupCount, channelCount, messageCount });
}
