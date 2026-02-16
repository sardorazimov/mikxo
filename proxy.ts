import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {

  const token = req.cookies.get("session")?.value

  const isAuth = !!token

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register")

  const isChatPage =
    req.nextUrl.pathname.startsWith("/chat")

  // not logged in → trying to access chat
  if (!isAuth && isChatPage) {

    return NextResponse.redirect(
      new URL("/login", req.url)
    )

  }

  // logged in → trying to access login/register
  if (isAuth && isAuthPage) {

    return NextResponse.redirect(
      new URL("/chat", req.url)
    )

  }

  return NextResponse.next()

}
