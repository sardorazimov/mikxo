import { db } from "@/db";
import { groups, groupMembers } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await db
    .select({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      avatarUrl: groups.avatarUrl,
      isPrivate: groups.isPrivate,
      ownerId: groups.ownerId,
      createdAt: groups.createdAt,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groupMembers.groupId, groups.id))
    .where(eq(groupMembers.userId, user.id));

  return Response.json(memberships);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description } = body;

  const [group] = await db
    .insert(groups)
    .values({ name, description, ownerId: user.id })
    .returning();

  await db.insert(groupMembers).values({
    groupId: group.id,
    userId: user.id,
    role: "owner",
  });

  return Response.json(group);
}

