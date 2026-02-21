import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("admin_session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
  return Response.json({ ok: true });
}
