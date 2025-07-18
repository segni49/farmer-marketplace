import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";



export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "BUYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const follow = await prisma.follow.findUnique({ where: { id: params.id } });

  if (!follow || follow.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
  }

  await prisma.follow.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}