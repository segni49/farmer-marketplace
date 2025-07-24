"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center bg-gradient-to-br from-[#76A85C] to-[#D7A541] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#143505] via-[#d6b305] to-[#2b0c03] bg-opacity-30" />

      <div className="z-10 space-y-6 px-4 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-bold drop-shadow-sm">Empowering Ethiopian Agriculture 🌾</h1>
        <p className="text-lg sm:text-xl drop-shadow-sm">
          Connect with verified local farmers. Discover organic, sustainable harvests from across the country.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link
            href="/items"
            className="px-6 py-3 bg-white text-[#76A85C] rounded font-semibold hover:bg-[#FDF7F0] text-sm"
          >
            Explore Marketplace
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-white text-white rounded font-semibold text-sm hover:bg-white hover:text-[#2E2312]"
          >
            Become a Farmer
          </Link>
        </div>
      </div>
    </section>
  );
}