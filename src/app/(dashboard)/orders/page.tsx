import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default async function BuyerOrdersPage() {
  const session = await getServerSession(options);

  const orders = await prisma.order.findMany({
    where: { buyerId: session?.user.id },
    include: {
      products: {
        include: {
          product: {
            select: { title: true, image: true, price: true }
          }
        }
      }
    },
    orderBy: { orderDate: "desc" }
  });

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-4 py-6 space-y-6">
      <h2 className="text-2xl text-[#3C2F1D] font-bold">My Orders</h2>

      {orders.length === 0 && (
        <p className="text-[#3C2F1D] text-sm">No orders yet. Go explore products!</p>
      )}

      <section className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6E8B3D] text-sm font-medium">
                Delivery: {order.deliveryType}
              </span>
              <span className="text-[#A47E3C] text-sm font-medium">
                Status: {order.status}
              </span>
            </div>

            <ul className="space-y-2">
              {order.products.map((item) => (
                <li key={item.id} className="flex gap-3 items-center">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-[#3C2F1D] font-semibold text-sm">
                      {item.product.title}
                    </p>
                    <p className="text-[#6E8B3D] text-sm">
                      Qty: {item.quantity} × ETB {item.product.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 text-sm text-[#3C2F1D]">
              Total: <span className="font-bold">ETB {order.totalAmount}</span>
            </div>

            <Link
              href={`/orders/${order.id}`}
              className="block text-[#A47E3C] text-sm mt-2 underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}