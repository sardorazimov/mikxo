
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function proxy(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // ✅ API auth routes'i bypass et (ÇOK ÖNEMLİ)
  if (
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // dashboard protected
  if (path.startsWith("/dashboard")) {

    const token =
      req.cookies.get("session")?.value;

    if (!token) {

      return NextResponse.redirect(
        new URL("/login", req.url)
      );

    }

    const session =
      await verifySession(token);

    if (!session) {

      return NextResponse.redirect(
        new URL("/login", req.url)
      );

    }

  }

  return NextResponse.next();

}
