import { db } from "@/db";
import { channels } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.query.channels.findMany({
    where: eq(channels.isPrivate, false),
    orderBy: (c, { asc }) => [asc(c.createdAt)],
  });

  return Response.json(rows);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, description, isPrivate } = body;

  const [channel] = await db
    .insert(channels)
    .values({ slug, description, isPrivate: isPrivate ?? false, creatorId: user.id })
    .returning();

  return Response.json(channel);
}
