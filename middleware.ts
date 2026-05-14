import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminHost } from "@/lib/hosts";

export function middleware(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const pathname = request.nextUrl.pathname;

  if (!isAdminHost(host)) {
    return NextResponse.next();
  }

  const isAllowedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt";

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin/blog", request.url));
  }

  if (!isAllowedPath) {
    return NextResponse.redirect(new URL("/admin/blog", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
