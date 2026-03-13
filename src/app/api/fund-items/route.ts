import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET() {
  const items = await prisma.fundItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Get highest sort order
  const last = await prisma.fundItem.findFirst({
    orderBy: { sortOrder: "desc" },
  });

  const item = await prisma.fundItem.create({
    data: {
      title: body.title,
      description: body.description || null,
      goalAmount: body.goalAmount || null,
      imageUrl: body.imageUrl || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
      visible: body.visible ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
