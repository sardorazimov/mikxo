import { db } from "@/db";
import { groups, groupMembers, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { groupId } = await params;

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });

  if (!group) return Response.json({ error: "Not found" }, { status: 404 });

  const members = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      role: groupMembers.role,
    })
    .from(groupMembers)
    .innerJoin(users, eq(groupMembers.userId, users.id))
    .where(eq(groupMembers.groupId, groupId));

  return Response.json({ ...group, members });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { groupId } = await params;

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });

  if (!group) return Response.json({ error: "Not found" }, { status: 404 });
  if (group.ownerId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, description } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "Group name is required" }, { status: 400 });
  }

  const [updated] = await db
    .update(groups)
    .set({ name: name.trim(), description: description ?? null })
    .where(eq(groups.id, groupId))
    .returning();

  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { groupId } = await params;

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });

  if (!group) return Response.json({ error: "Not found" }, { status: 404 });
  if (group.ownerId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

  await db.delete(groupMembers).where(eq(groupMembers.groupId, groupId));
  await db.delete(groups).where(eq(groups.id, groupId));

  return Response.json({ ok: true });
}
