import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verification";

const PUBLIC_COUNTRIES = ["in", "us", "uk"]; // Update based on your available countries

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // --------------------------
  // 🔐 ADMIN PROTECTION
  // --------------------------
  if (pathname.startsWith("/works") && !pathname.startsWith("/works/login")) {
    const token = req.cookies.get("authToken");

    if (!token) {
      return NextResponse.redirect(new URL("/works/login", req.url));
    }

    try {
      const decoded = await verifyToken(token.value);
      const userRole = decoded?.role;

      if (!decoded || !userRole) {
        return NextResponse.redirect(new URL("/works/login", req.url));
      }
      if (req.nextUrl.pathname === "/works") {
        return NextResponse.redirect(new URL("/works/dashboard", req.url));
      }
    } catch (err) {
      console.error("Auth error:", err.message);
      return NextResponse.redirect(new URL("/works/login", req.url));
    }
  }

  // --------------------------
  // 🌍 COUNTRY REDIRECTION
  // --------------------------
  const alreadyHasCountry = PUBLIC_COUNTRIES.some((c) =>
    pathname.startsWith(`/${c}`)
  );

  const isApiOrAssets =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico";

  const isAdminRoute = pathname.startsWith("/works");

  if (!alreadyHasCountry && !isApiOrAssets && !isAdminRoute) {
    const country = req.geo?.country?.toLowerCase();
    // const country = req.geo?.country?.toLowerCase() || "in";

    if (country && PUBLIC_COUNTRIES.includes(country)) {
      return NextResponse.redirect(new URL(`/${country}${pathname}`, req.url));
    } else {
      if (pathname === "/") {
        return NextResponse.next(); // already on home, let it load
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
