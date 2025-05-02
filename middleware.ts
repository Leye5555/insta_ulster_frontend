import { NextRequest, NextResponse } from "next/server";

// const allowedOrigins = ["http://localhost:8000"];

// const corsOptions = {
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

export function middleware(req: NextRequest) {
  // // Check the origin from the request
  // const origin = req.headers.get("origin") ?? "";
  // const isAllowedOrigin = allowedOrigins.includes(origin);

  // // Handle pre-flighted requests
  // const isPreflight = req.method === "OPTIONS";

  // if (isPreflight) {
  //   const preflightHeaders = {
  //     ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
  //     ...corsOptions,
  //   };
  //   return NextResponse.json({}, { headers: preflightHeaders });
  // }

  // // Handle simple requests
  // const response = NextResponse.next();

  // if (isAllowedOrigin) {
  //   response.headers.set("Access-Control-Allow-Origin", origin);
  // }

  // Object.entries(corsOptions).forEach(([key, value]) => {
  //   response.headers.set(key, value);
  // });
  console.log("ran");
  const user = req.cookies.get("AUTH")?.value;
  const authPaths = [
    "/signup",
    "/signup/confirm-email",
    "/signup/set-password",
    "/signup/set-profile",
    "/login",
  ];
  const urlPath = new URL(req.url).pathname;
  console.log(urlPath);
  if (!user && !authPaths.includes(urlPath)) {
    return NextResponse.redirect(new URL("/login/", req.url));
  } else if (user && authPaths.includes(urlPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/signup/:path*", "/login/:path*", "/api/:path*"],
};
