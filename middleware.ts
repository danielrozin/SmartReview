import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Add Last-Modified header for product and comparison pages
  if (
    pathname.startsWith("/category/") ||
    pathname.startsWith("/compare/")
  ) {
    const lastModified = new Date().toUTCString();
    response.headers.set("Last-Modified", lastModified);
  }

  return response;
}

export const config = {
  matcher: ["/category/:path*", "/compare/:path*"],
};
