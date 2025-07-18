import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default async function FarmerProductsPage() {
  const session = await getServerSession (options);
  const products = await prisma.product.findMany({
    where: { farmerId: session?.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#3C2F1D] font-bold">My Products</h2>
        <Link
          href="/dashboard/products/new"
          className="bg-[#6E8B3D] text-white px-4 py-2 rounded-md hover:bg-[#597031]"
        >
          + Add Product
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-md p-4 shadow-sm">
            <Image
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg text-[#3C2F1D] font-semibold">{product.title}</h3>
            <p className="text-sm text-[#6E8B3D]">ETB {product.price}</p>
            <div className="mt-2 text-xs text-[#A47E3C]">Qty: {product.quantity}</div>
            <div className="mt-4 flex justify-between text-sm">
              <Link
                href={`/dashboard/products/edit/${product.id}`}
                className="text-[#3C2F1D] underline"
              >
                Edit
              </Link>
              <Link
                href={`/dashboard/products/delete/${product.id}`}
                className="text-red-500 underline"
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}