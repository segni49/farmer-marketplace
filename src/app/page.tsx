import Link from "next/link";

export default function HomePage() {
  return (
    <main className="px-6 py-12 space-y-20 text-center">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#3C2F1D]">
          Empowering Ethiopian Farmers
        </h1>
        <p className="text-[#6E8B3D] text-lg max-w-xl mx-auto">
          Explore fresh, locally sourced products directly from the growers. Support sustainable agriculture across regions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Link
            href="/products"
            className="bg-[#6E8B3D] text-white px-6 py-3 rounded-md text-sm hover:bg-[#597031]"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/register"
            className="border border-[#6E8B3D] text-[#6E8B3D] px-6 py-3 rounded-md text-sm hover:bg-[#B6C85B]/20"
          >
            Become a Farmer
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { title: "Direct Trade", desc: "Connect buyers with farmers without middlemen" },
          { title: "Sustainable", desc: "Eco-friendly and locally driven agriculture" },
          { title: "Community", desc: "Empowering rural development and food security" },
        ].map((feat) => (
          <div key={feat.title} className="bg-white border rounded-md p-6 shadow-sm">
            <h3 className="text-[#6E8B3D] font-semibold text-lg">{feat.title}</h3>
            <p className="text-sm text-[#3C2F1D] mt-2">{feat.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}