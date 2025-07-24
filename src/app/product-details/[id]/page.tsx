import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      farmer: { select: { id: true, name: true, image: true } },
      reviews: {
        include: { buyer: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!product) {
    return <main className="p-6 text-red-500">Product not found.</main>;
  }

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 space-y-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {product.image && (
          <Image
            src={product.image}
            alt={product.title}
            className="w-full h-60 object-cover rounded-md"
          />
        )}
        <h1 className="text-3xl font-bold text-[#3C2F1D]">{product.title}</h1>
        <p className="text-[#6E8B3D] text-lg">ETB {product.price}</p>
        <p className="text-sm text-[#3C2F1D]">Available: {product.quantity}</p>
        <p className="text-[#3C2F1D] mt-4">{product.description}</p>

        {/* 🧑‍🌾 Farmer Info */}
        <div className="mt-6 flex items-center gap-4">
          {product.farmer.image && (
            <Image
              src={product.farmer.image}
              alt={product.farmer.name}
              className="h-10 w-10 object-cover rounded-full"
            />
          )}
          <Link
            href={`/farmers/${product.farmer.id}`}
            className="text-[#A47E3C] underline font-medium"
          >
            {product.farmer.name}
          </Link>
        </div>

        {/* ⭐ Rating */}
        {averageRating && (
          <p className="text-sm text-[#6E8B3D]">★ {averageRating.toFixed(1)} from {product.reviews.length} reviews</p>
        )}

        {/* 🛒 CTA */}
        <Link
          href={`/dashboard/orders/new?productId=${product.id}`}
          className="inline-block mt-4 px-4 py-2 bg-[#6E8B3D] text-white rounded hover:bg-[#597031]"
        >
          Order Now
        </Link>

        {/* 💬 Reviews */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-[#3C2F1D]">Buyer Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="text-sm text-[#3C2F1D]">No reviews yet.</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="border rounded-md p-3 bg-white shadow-sm">
                <p className="text-sm text-[#6E8B3D]">★ {review.rating}</p>
                <p className="text-sm font-medium text-[#3C2F1D]">{review.buyer.name}</p>
                <p className="text-sm text-[#3C2F1D] mt-1">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}