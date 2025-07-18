import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

export default async function AdminMetricsPage() {
  const session = await getServerSession(options);
  if (session?.user.role !== "ADMIN") {
    return <p className="p-6 text-red-500">Access Denied</p>;
  }

  const [totalUsers, totalOrders, totalProducts] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count()
  ]);

  const roles = await prisma.user.groupBy({
    by: ["role"],
    _count: { id: true }
  });

  const dailyOrders = await prisma.order.groupBy({
    by: ["orderDate"],
    _count: { id: true }
  });

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-8 space-y-8">
      <h2 className="text-3xl font-bold text-[#3C2F1D] text-center">Platform Metrics</h2>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-white border rounded-md p-4 shadow">
          <h3 className="text-xl text-[#6E8B3D] font-semibold">Users</h3>
          <p className="text-[#3C2F1D] text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white border rounded-md p-4 shadow">
          <h3 className="text-xl text-[#6E8B3D] font-semibold">Orders</h3>
          <p className="text-[#3C2F1D] text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white border rounded-md p-4 shadow">
          <h3 className="text-xl text-[#6E8B3D] font-semibold">Products</h3>
          <p className="text-[#3C2F1D] text-2xl font-bold">{totalProducts}</p>
        </div>
      </section>

      <section className="bg-white border rounded-md p-6 shadow space-y-4">
        <h3 className="text-xl text-[#3C2F1D] font-bold">User Roles</h3>
        <ul className="text-[#6E8B3D] space-y-2">
          {roles.map((role) => (
            <li key={role.role} className="flex justify-between">
              <span>{role.role}</span>
              <span>{role._count.id}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border rounded-md p-6 shadow space-y-4">
        <h3 className="text-xl text-[#3C2F1D] font-bold">Daily Orders</h3>
        <ul className="text-[#6E8B3D] space-y-2">
          {dailyOrders.map((entry) => (
            <li key={entry.orderDate.toISOString()} className="flex justify-between">
              <span>{entry.orderDate.toLocaleDateString()}</span>
              <span>{entry._count.id}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}