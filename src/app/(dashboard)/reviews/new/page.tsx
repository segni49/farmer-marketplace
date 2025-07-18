"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateReviewPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const router = useRouter();

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => setProductTitle(data.title))
        .catch(() => setProductTitle(""));
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: parseInt(rating),
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      router.push(`/products/${productId}`);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 flex justify-center">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-[#3C2F1D]">
          Review for {productTitle || "Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block text-sm text-[#3C2F1D] mb-1">
              Rating (1 to 5)
            </label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm text-[#3C2F1D] mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love or what could improve?"
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6E8B3D] hover:bg-[#597031]"
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}