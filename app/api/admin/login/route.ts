import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const { password } = body;

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  // Use constant-time comparison to prevent timing attacks
  let passwordsMatch = false;
  if (password && adminPassword) {
    try {
      const a = Buffer.from(password, "utf8");
      const b = Buffer.from(adminPassword, "utf8");
      if (a.length === b.length) {
        passwordsMatch = timingSafeEqual(a, b);
      }
    } catch {
      passwordsMatch = false;
    }
  }

  if (!passwordsMatch) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  (await cookies()).set("admin_session", "valid", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return Response.json({ ok: true });
}
