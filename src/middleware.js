import { NextResponse } from "next/server";
// import { verifyToken } from "./app/utils/verification";

export async function middleware(req) {
  try {
    const token = req.cookies.get("authToken");

    // if (!token) {
    //   const response = NextResponse.redirect(new URL("/login", req.url));
    //   return response;
    // }
    // const decoded = await verifyToken(token.value);

    // const userRole = decoded?.role;

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const response = NextResponse.next();
    return response;
  } catch (error) {
    console.error("Auth error:", error.message);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  }
}

export const config = {
  matcher: [
    /*
      Add all routes here that need authentication.
      If every page except login should be protected:
    */
    "/((?!login).*)", // Matches everything except /login
  ],
};
