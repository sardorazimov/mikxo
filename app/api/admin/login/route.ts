import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { password } = body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  (await cookies()).set("admin_session", "valid", {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return Response.json({ ok: true });
}
