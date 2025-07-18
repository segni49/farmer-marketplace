import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default async function FarmerProfilePage({ params }: { params: { id: string } }) {
  const farmer = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      products: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          image: true,
          price: true
        }
      }
    }
  });

  if (!farmer) {
    return <main className="p-6 text-red-500">Farmer not found.</main>;
  }

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 space-y-6">
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        {farmer.image && (
          <Image
            src={farmer.image}
            alt={farmer.name}
            className="h-20 w-20 object-cover rounded-full mx-auto"
          />
        )}
        <h1 className="text-2xl font-bold text-[#3C2F1D]">{farmer.name}</h1>
        {farmer.bio && <p className="text-[#3C2F1D]">{farmer.bio}</p>}
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-[#6E8B3D] mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {farmer.products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white border rounded-md p-4 shadow-sm hover:shadow-lg transition"
            >
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  className="h-32 w-full object-cover rounded mb-2"
                />
              )}
              <h3 className="text-[#3C2F1D] font-semibold text-sm">{product.title}</h3>
              <p className="text-sm text-[#6E8B3D]">ETB {product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}