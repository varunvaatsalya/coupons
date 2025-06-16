const { NextResponse } = require("next/server");
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const newUser = await prisma.user.create({
      data: { name: "bachi", email: "nidhilla@gmail.com" },
    });
    return NextResponse.json(
      { newUser, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
