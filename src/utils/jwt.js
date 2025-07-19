import { jwtVerify, SignJWT } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(JWT_SECRET);

// Generate token — no change needed
export const generateToken = async (user) => {
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    editPermission: user.editPermission,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2d")
    .sign(secret);

  return token;
};

// Verify token and check logout status
export const verifyTokenWithLogout = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.id;
    const userRole = payload.role;
    const tokenIssuedAt = payload.iat * 1000;

    let isInvalidated = false;

    const role =
      userRole === "admin" && userId === "0" ? "default_admin" : userRole;

    // 1. Check role-level logout
    const logoutDoc = await prisma.roleLogout.findUnique({
      where: { role },
    });

    if (
      logoutDoc &&
      logoutDoc.lastLogoutAt.getTime() > tokenIssuedAt
    ) {
      isInvalidated = true;
    }

    // 2. Check individual user logout (only non-admins)
    if (userRole !== "admin") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          lastLogoutByAdmin: true,
          isLogoutPending: true,
        },
      });

      if (
        user?.lastLogoutByAdmin &&
        user.lastLogoutByAdmin.getTime() > tokenIssuedAt
      ) {
        isInvalidated = true;

        // Reset isLogoutPending flag
        await prisma.user.update({
          where: { id: userId },
          data: { isLogoutPending: false },
        });
      }
    }

    if (isInvalidated) return null;

    return payload;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
};
