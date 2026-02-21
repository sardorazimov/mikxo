import { db } from "@/db";
import { messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq, or, and } from "drizzle-orm";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId");
  const userId = searchParams.get("userId");

  if (channelId) {
    const rows = await db.query.messages.findMany({
      where: eq(messages.channelId, channelId),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });
    return Response.json(rows);
  }

  if (userId) {
    const rows = await db.query.messages.findMany({
      where: or(
        and(eq(messages.senderId, user.id), eq(messages.receiverId, userId)),
        and(eq(messages.senderId, userId), eq(messages.receiverId, user.id))
      ),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });
    return Response.json(rows);
  }

  return Response.json({ error: "channelId or userId required" }, { status: 400 });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { content, channelId, receiverId } = body;

  const [msg] = await db
    .insert(messages)
    .values({
      senderId: user.id,
      content,
      channelId: channelId ?? null,
      receiverId: receiverId ?? null,
    })
    .returning();

  return Response.json(msg);
}
