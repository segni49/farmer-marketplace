import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options"; 



export async function GET() {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [totalUsers, totalOrders, totalProducts] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count()
  ]);

  const dailyOrders = await prisma.order.groupBy({
    by: ["orderDate"],
    _count: { id: true }
  });

  return NextResponse.json({
    totalUsers,
    totalOrders,
    totalProducts,
    dailyOrders
  });
}