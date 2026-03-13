import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!["pending", "confirmed", "not_received"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updateData.status = body.status;
    if (body.status === "confirmed") {
      updateData.confirmedAt = new Date();
    }
  }

  if (body.amount !== undefined) updateData.amount = body.amount;
  if (body.notes !== undefined) updateData.notes = body.notes;

  const contribution = await prisma.contribution.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(contribution);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.contribution.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
