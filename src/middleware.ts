import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  const isLocalhost = host.includes("localhost");

  const isMainDomain =
    host === "solmint.space" ||
    host === "www.solmint.space" ||
    host.includes("vercel.app") ||
    isLocalhost;

  if (isMainDomain) {
    return NextResponse.next();
  }

  const subdomain = host.replace(".solmint.space", "");

  url.pathname = `/site/${subdomain}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};