import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { ilike } from "drizzle-orm";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(ilike(users.username, `%${q}%`))
    .limit(20);

  return Response.json(rows);
}
