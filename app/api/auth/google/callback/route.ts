import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const code = url.searchParams.get("code");

    const codeVerifier = (await cookies()).get("oauth_code_verifier")?.value;

    if (!code || !codeVerifier) {
      return new Response("Missing OAuth data", { status: 400 });
    }

    // token al
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // google user info al
    const googleUser = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      },
    ).then((res) => res.json());

    if (!googleUser?.sub) {
      return new Response("Google user fetch failed", { status: 500 });
    }

    // user var mı kontrol et
    let user = await db.query.users.findFirst({
      where: eq(users.googleId, googleUser.sub),
    });

    // yoksa oluştur
    if (!user) {
      const inserted = await db
        .insert(users)
        .values({
          email: googleUser.email,

          googleId: googleUser.sub,

          avatarUrl: googleUser.picture ?? null,

          username: null,
        })
        .returning();

      user = inserted[0];
    }

    if (!user) {
      return new Response("User creation failed", { status: 500 });
    }

    // session oluştur
    const session = await createSession(user.id);

    (await cookies()).set("session", session, {
      httpOnly: true,

      secure: false, // dev için false

      sameSite: "lax",

      path: "/",
    });

    // redirect dashboard
    // Şunun yerine:
    // return Response.redirect(new URL("/dashboard", req.url));

    // Şunu dene (Daha güvenli):
    return Response.redirect(
      new URL(
        "/dashboard",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      ),
    );
  } catch (error) {
    console.error("GOOGLE CALLBACK ERROR:", error);

    return new Response("OAuth failed", { status: 500 });
  }
}
