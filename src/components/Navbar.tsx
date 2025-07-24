"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <nav className="bg-white border-b border-[#DAD7C9] sticky top-0 z-50 shadow-sm px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-[#76A85C] tracking-tight">FarmerLink</Link>

      <div className="hidden sm:flex gap-6 items-center text-sm font-medium text-[#2E2312]">
        <Link href="/items" className="hover:text-[#D7A541]">Marketplace</Link>
        <Link href="/farmers" className="hover:text-[#D7A541]">Farmers</Link>
        <Link href="/contact" className="hover:text-[#D7A541]">Contact</Link>

        {/* Conditional Links */}
        {!session && (
          <>
            <Link href="/login" className="hover:text-[#D7A541]">Login</Link>
            <Link href="/register" className="border px-3 py-1 rounded border-[#76A85C] text-[#76A85C] hover:bg-[#FDF7F0] transition font-semibold">
              Join
            </Link>
          </>
        )}

        {session && (
          <Link
            href={
              userRole === "FARMER"
                ? "/dashboard"
                : userRole === "BUYER"
                ? "/items"
                : "/admin"
            }
            className="font-semibold text-[#76A85C] hover:text-[#597031]"
          >
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
}