import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function DashboardEntry() {
  const session = await getServerSession(options);
  const role = session?.user?.role;

  if (!session) return redirect("/login");

  if (role === "FARMER") return redirect("/dashboard/farmer");
  if (role === "BUYER") return redirect("/dashboard/buyer");
  if (role === "ADMIN") return redirect("/dashboard/admin");

  return <main className="p-6 text-red-500">Unknown role</main>;
}