import { auth } from "@/utils/auth";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const withAuth = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isSetting = req.nextUrl.pathname.startsWith("/setting");

  if ((isDashboard || isSetting) && !isLoggedIn) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // NextAuth middleware is (request, event); cast for proxy compatibility
  const handler = withAuth as unknown as (
    req: NextRequest,
    ev: NextFetchEvent
  ) => Promise<Response> | Response;
  return handler(request, event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/setting/:path*"],
};
