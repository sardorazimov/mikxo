import { db } from "@/db";
import { channels } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { channelId } = await params;

  const channel = await db.query.channels.findFirst({
    where: eq(channels.id, channelId),
  });

  if (!channel) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(channel);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { channelId } = await params;

  const channel = await db.query.channels.findFirst({
    where: eq(channels.id, channelId),
  });

  if (!channel) return Response.json({ error: "Not found" }, { status: 404 });
  if (channel.creatorId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { slug, description } = body;

  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return Response.json({ error: "Channel slug is required" }, { status: 400 });
  }
  const slugValue = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");

  const [updated] = await db
    .update(channels)
    .set({ slug: slugValue, description: description ?? null })
    .where(eq(channels.id, channelId))
    .returning();

  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { channelId } = await params;

  const channel = await db.query.channels.findFirst({
    where: eq(channels.id, channelId),
  });

  if (!channel) return Response.json({ error: "Not found" }, { status: 404 });
  if (channel.creatorId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

  await db.delete(channels).where(eq(channels.id, channelId));

  return Response.json({ ok: true });
}
