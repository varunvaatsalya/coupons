import { NextResponse } from "next/server";
import { verifyTokenWithLogout } from "@/utils/jwt";
import prisma from "@/lib/prisma";

const model = prisma.geographicCountry;

export async function GET(req) {
  const token = req.cookies.get("authToken");

  if (!token) {
    return NextResponse.json(
      { route: "/login", success: false, message: "Token not found" },
      { status: 401 }
    );
  }

  const decoded = await verifyTokenWithLogout(token.value);
  const userRole = decoded?.role;
  if (!decoded || !userRole) {
    let res = NextResponse.json(
      { message: "Invalid token.", success: false },
      { status: 403 }
    );
    res.cookies.delete("authToken");
    return res;
  }

  try {
    const countries = await model.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      {
        countries,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch configs", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { id, name, currencyCode, currencySymbol } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Invalid request", success: false },
        { status: 400 }
      );
    }

    console.log(id, name, currencyCode, currencySymbol);
    let result;

    if (id) {
      result = await model.update({
        where: { id },
        data: {
          name,
          currencyCode: currencyCode ?? "",
          currencySymbol: currencySymbol ?? "",
        },
      });
    } else {
      try {
        result = await model.create({
          data: {
            name,
            currencyCode: currencyCode ?? "",
            currencySymbol: currencySymbol ?? "",
          },
        });
      } catch (err) {
        if (err.code === "P2002") {
          return NextResponse.json(
            { message: `Value Already exist!`, success: false },
            { status: 409 }
          );
        }
        throw err;
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Config upsert error:", err);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid type or id", success: false },
        { status: 400 }
      );
    }

    const result = await model.deleteMany({
      where: { id },
    });
    console.log(result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Config delete error:", err);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
