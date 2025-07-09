import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { generateToken, verifyTokenWithLogout } from "@/utils/jwt";
import { credentials } from "@/app/credentials";

export async function GET(req) {
  const token = req.cookies.get("authToken");
  if (!token) {
    console.log("Token not found. Redirecting to login.");
    return NextResponse.json(
      { route: "/login", success: false, message: "Token not found" },
      { status: 401 }
    );
  }

  const decoded = await verifyTokenWithLogout(token.value);
  const userRole = decoded?.role;
  if (!decoded || !userRole) {
    return NextResponse.json(
      { route: "/login", success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { route: `/dashboard`, success: true },
    { status: 200 }
  );
}

export async function POST(req) {
  
  const { email, password, role } = await req.json();

  const logLoginAttempt = async (status) => {
    const ip = req.headers.get("x-forwarded-for") || "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Unknown User-Agent";

    try {
      await prisma.loginHistory.create({
        data: {
          attemptedUserEmail: email || "Invalid",
          role: role || null,
          ipAddress: ip,
          userAgent: userAgent,
          status: status,
        },
      });
    } catch (err) {
      console.error("Failed to save login history:", err);
    }
  };

  const cookieStore = await cookies();

  try {
    if (role === "admin") {
      let admin;
      if (email == credentials.email) {
        admin = credentials;
      } else {
        admin = await prisma.admin.findUnique({
          where: { email },
        });
        if (!admin) {
          await logLoginAttempt("failed");
          return NextResponse.json(
            { message: "User not found", success: false },
            { status: 404 }
          );
        }
      }
      if (admin.password !== password) {
        await logLoginAttempt("failed");
        return NextResponse.json(
          { message: "Invalid password", success: false },
          { status: 401 }
        );
      }

      const token = await generateToken({
        id: admin.id,
        email: admin.email,
        role,
        editPermission: true,
      });

      cookieStore.set({
        name: "authToken",
        value: token,
        path: "/",
        maxAge: 2 * 24 * 60 * 60,
      });

      await logLoginAttempt("success");
      return NextResponse.json({
        messages: "Login successful",
        user: {
          id: admin.id,
          email: admin.email,
          role,
          editPermission: true,
        },
        success: true,
      });
    }
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      await logLoginAttempt("failed");
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if the role matches
    if (user.role !== role) {
      await logLoginAttempt("failed");
      return NextResponse.json(
        { message: "Role mismatch", success: false },
        { status: 403 }
      );
    }

    // Check if the password matches
    if (user.password !== password) {
      await logLoginAttempt("failed");
      return NextResponse.json(
        { message: "Invalid password", success: false },
        { status: 401 }
      );
    }

    const token = await generateToken(user);

    cookieStore.set({
      name: "authToken",
      value: token,
      path: "/",
      maxAge: 2 * 24 * 60 * 60,
    });
    // If everything matches, return success
    await logLoginAttempt("success");
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          editPermission: user.editPermission,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
