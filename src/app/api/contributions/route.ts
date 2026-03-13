import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";
import { sendContributionNotification } from "@/lib/email";

export async function GET() {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contributions = await prisma.contribution.findMany({
    orderBy: { createdAt: "desc" },
    include: { fundItem: true },
  });

  return NextResponse.json(contributions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { guestName, guestEmail, amount, message, paymentMethod, ecardTemplate, ecardMessage, fundItemId } = body;

  if (!guestName || !guestEmail || !amount || !paymentMethod) {
    return NextResponse.json(
      { error: "Missing required fields: guestName, guestEmail, amount, paymentMethod" },
      { status: 400 }
    );
  }

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
  }

  const contribution = await prisma.contribution.create({
    data: {
      guestName,
      guestEmail,
      amount,
      message: message || null,
      paymentMethod,
      ecardTemplate: ecardTemplate || null,
      ecardMessage: ecardMessage || null,
      fundItemId: fundItemId || null,
    },
  });

  // Send email notification to couple (non-blocking)
  sendContributionNotification(contribution).catch(() => {});

  return NextResponse.json(contribution, { status: 201 });
}
