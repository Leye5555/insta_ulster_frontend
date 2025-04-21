import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const user = true;
  const authPaths = [
    "/signup/",
    "/signup/confirm-email/",
    "/signup/set-password/",
    "/signup/set-profile/",
    "/login/",
  ];
  const urlPath = new URL(req.url).pathname;
  console.log(urlPath);
  if (!user && !authPaths.includes(urlPath)) {
    return NextResponse.redirect(new URL("/login/", req.url));
  }
}

export const config = {
  matcher: ["/", "/signup/:path*", "/login/:path*"],
};
