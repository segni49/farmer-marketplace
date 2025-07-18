import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options"; 
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);

  if (!session || !session.user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F4ED]">
        <div className="text-center space-y-4">
          <p className="text-[#3C2F1D] text-lg">You must be logged in to access the dashboard.</p>
          <Link href="/login" className="text-[#A47E3C] underline font-semibold">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F4ED]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#6E8B3D] text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav className="space-y-2">
          {role === "FARMER" && (
            <>
              <Link href="/dashboard/products" className="block hover:underline">My Products</Link>
              <Link href="/dashboard/orders" className="block hover:underline">Orders</Link>
            </>
          )}
          {role === "BUYER" && (
            <>
              <Link href="/dashboard/orders" className="block hover:underline">My Orders</Link>
              <Link href="/dashboard/following" className="block hover:underline">Following</Link>
            </>
          )}
          {role === "ADMIN" && (
            <>
              <Link href="/dashboard/moderation" className="block hover:underline">Moderation</Link>
              <Link href="/dashboard/metrics" className="block hover:underline">Metrics</Link>
            </>
          )}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}