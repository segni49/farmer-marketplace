import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";



export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      buyer: { select: { name: true, email: true } },
      products: {
        include: {
          product: {
            include: {
              farmer: { select: { name: true, image: true } }
            }
          }
        }
      }
    }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Only allow buyer or linked farmers to view
  const isOwner = order.buyerId === session.user.id;
  const isLinkedFarmer = order.products.some(
    (p) => p.product.farmerId === session.user.id
  );

  if (!isOwner && !isLinkedFarmer && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();

  if (!["CONFIRMED", "DELIVERED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      products: {
        include: {
          product: { select: { farmerId: true } }
        }
      }
    }
  });

  const isLinkedFarmer = order?.products.some(
    (p) => p.product.farmerId === session.user.id
  );

  const canUpdate =
    session.user.role === "ADMIN" || (isLinkedFarmer && session.user.role === "FARMER");

  if (!canUpdate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status }
  });

  return NextResponse.json(updated);
}