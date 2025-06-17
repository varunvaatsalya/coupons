import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verification";

export async function middleware(req) {
  try {
    const token = req.cookies.get("authToken");

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const decoded = await verifyToken(token.value);
    const userRole = decoded?.role;
    if (!decoded || !userRole) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api).*)"],
};
