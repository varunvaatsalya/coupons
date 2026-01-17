import { NextResponse } from "next/server";
import { verifyTokenWithLogout } from "@/utils/jwt";
import Network from "@/models/Network";
// import prisma from "@/lib/prisma";

export async function GET(req) {
  let sort = req.nextUrl.searchParams.get("sort");

  await dbConnect();

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
    const sortStage = sort === "name" ? { name: 1 } : { createdAt: -1 };

    const networks = await Network.aggregate([
      {
        $lookup: {
          from: "merchants", // collection name
          localField: "_id",
          foreignField: "network",
          as: "merchants",
        },
      },
      {
        $addFields: {
          merchantCount: { $size: "$merchants" },
        },
      },
      {
        $project: {
          merchants: 0,
        },
      },
      {
        $sort: sortStage,
      },
    ]);

    return NextResponse.json(
      {
        networks,
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
  if (userRole !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 403 }
    );
  }
  try {
    const { id, name, parameters } = await req.json();

    let result;

    if (id) {
      result = await Network.findByIdAndUpdate(
        id,
        { name, parameters },
        { new: true }
      );

      if (!result) {
        return NextResponse.json(
          { message: "Network not found", success: false },
          { status: 404 }
        );
      }
    } else {
      result = await Network.create({
        name,
        parameters,
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Config upsert error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        {
          message: "Network with this name already exists",
          success: false,
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing ID" },
      { status: 400 }
    );
  }

  try {
    const deleted = await Network.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Network not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete network" },
      { status: 500 }
    );
  }
}
