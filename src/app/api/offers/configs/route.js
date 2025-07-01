import { NextResponse } from "next/server";
import { verifyTokenWithLogout } from "@/utils/jwt";
import prisma from "@/lib/prisma";

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
    const [offerType] = await Promise.all([
      prisma.offerType.findMany({ orderBy: { name: "asc" } }),
    ]);

    return NextResponse.json(
      {
        data: {
          offerType,
        },
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

const modelMap = {
  offerType: prisma.offerType,
};

const updateFieldsMap = {
  offerType: ["name"],
};

export async function POST(req) {
  try {
    const { type, value } = await req.json();

    if (!type || !value || !modelMap[type]) {
      return NextResponse.json(
        { message: "Invalid type or value", success: false },
        { status: 400 }
      );
    }

    const model = modelMap[type];
    const updateFields = updateFieldsMap[type];

    let result;

    if (value.id) {
      result = await model.update({
        where: { id: value.id },
        data: updateFields.reduce((acc, key) => {
          if (value[key] !== undefined) acc[key] = value[key];
          return acc;
        }, {}),
      });
    } else {
      try {
        result = await model.create({
          data: value,
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
    const { type, id } = await req.json();

    if (!type || !id || !modelMap[type]) {
      return NextResponse.json(
        { message: "Invalid type or id", success: false },
        { status: 400 }
      );
    }

    const model = modelMap[type];
    if (!model) {
      return NextResponse.json(
        { message: "Invalid type", success: false },
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
