import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";
import { sendNudgeEmail } from "@/lib/email";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const contribution = await prisma.contribution.findUnique({ where: { id } });

  if (!contribution) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (contribution.status !== "pending") {
    return NextResponse.json(
      { error: "Can only nudge pending contributions" },
      { status: 400 }
    );
  }

  await sendNudgeEmail(contribution);

  return NextResponse.json({ success: true });
}
