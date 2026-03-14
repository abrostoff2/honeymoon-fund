import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { guestName, guestEmail, amount, paymentMethod, status, notes } = body;

  if (!guestName || !amount || !paymentMethod) {
    return NextResponse.json(
      { error: "Missing required fields: guestName, amount, paymentMethod" },
      { status: 400 }
    );
  }

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be a positive number" },
      { status: 400 }
    );
  }

  const validStatuses = ["pending", "confirmed"];
  const finalStatus = validStatuses.includes(status) ? status : "confirmed";

  const contribution = await prisma.contribution.create({
    data: {
      guestName,
      guestEmail: guestEmail || "",
      amount,
      paymentMethod,
      status: finalStatus,
      notes: notes || null,
      confirmedAt: finalStatus === "confirmed" ? new Date() : null,
    },
  });

  return NextResponse.json(contribution, { status: 201 });
}
