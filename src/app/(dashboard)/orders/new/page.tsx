"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CreateOrderPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [deliveryType, setDeliveryType] = useState("LOCAL_PICKUP");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch(() => setError("Failed to load product"));
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: parseInt(quantity),
          deliveryType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      router.push("/dashboard/orders");
    } catch (err: unknown) {
        if(err instanceof Error) {
            setError(err.message);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-[#3C2F1D]">Place Order</h2>
        {product && (
          <div className="space-y-2">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md"
              />
            )}
            <p className="text-[#3C2F1D] font-semibold">{product.title}</p>
            <p className="text-[#6E8B3D] text-sm">Price: ETB {product.price}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="text-sm text-[#3C2F1D] block mb-1">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="1"
              max={product?.quantity ?? 10}
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="deliveryType" className="text-sm text-[#3C2F1D] block mb-1">
              Delivery Method
            </label>
            <select
              id="deliveryType"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            >
              <option value="LOCAL_PICKUP">Local Pickup</option>
              <option value="REGIONAL_SHIPPING">Regional Shipping</option>
              <option value="NATIONAL_SHIPPING">National Shipping</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6E8B3D] hover:bg-[#597031]"
            }`}
          >
            {loading ? "Ordering..." : "Confirm Order"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}