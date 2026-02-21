import { db } from "@/db";
import { groups, groupMembers, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq, and } from "drizzle-orm";

// POST /api/groups/[groupId]/members - invite a user by username
export async function POST(
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

  // Only owner/admin can invite
  const myMembership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
  });
  if (!myMembership || (myMembership.role !== "owner" && myMembership.role !== "admin")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { username } = body;

  const invitee = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!invitee) return Response.json({ error: "User not found" }, { status: 404 });

  const existing = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, invitee.id)),
  });
  if (existing) return Response.json({ error: "Already a member" }, { status: 409 });

  const [member] = await db
    .insert(groupMembers)
    .values({ groupId, userId: invitee.id, role: "member" })
    .returning();

  return Response.json(member);
}

// DELETE /api/groups/[groupId]/members?userId=... - remove a member
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { groupId } = await params;
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("userId");

  if (!targetUserId) return Response.json({ error: "userId required" }, { status: 400 });

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!group) return Response.json({ error: "Not found" }, { status: 404 });

  // Allow leaving (self) or owner removing others
  if (targetUserId !== user.id && group.ownerId !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await db
    .delete(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, targetUserId)));

  return Response.json({ ok: true });
}
