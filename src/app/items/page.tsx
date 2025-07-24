"use client";
import { useState, useEffect } from "react";

import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";

type Product = {
  id: string;
  title: string;
  image?: string;
  price: number;
  category: string;
  farmer: { id: string; name: string; image?: string };
};

export default function ItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filtered = products.filter((p) => {
    const titleMatch = p.title.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = category ? p.category === category : true;
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const priceMatch = p.price >= min && p.price <= max;
    return titleMatch && categoryMatch && priceMatch;
  });

  return (
    <main className="min-h-screen bg-[#FDF7F0] px-6 py-10">
      <SectionTitle emoji="🛍️" text="Marketplace" />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto my-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-[#76A85C] focus:ring-2"
        />
        <label htmlFor="category-select" className="sr-only">
          Category
        </label>
        <select
          id="category-select"
          title="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-[#76A85C] focus:ring-2"
        >
          <option value="">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Grains">Grains</option>
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-[#DAD7C9] rounded-md focus:ring-[#76A85C] focus:ring-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-[#DAD7C9] rounded-md focus:ring-[#76A85C] focus:ring-2"
          />
        </div>
      </div>

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}