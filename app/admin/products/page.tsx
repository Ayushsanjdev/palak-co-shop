import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminProductTable from "@/components/AdminProductTable";

// Server Component -- checks the session cookie directly against the DB
// before rendering anything. A non-admin (or logged-out) visitor hitting
// /admin/products gets redirected, never sees product data or the form.
export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);

  if (!admin) redirect("/");

  const products = await db.product.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display mb-2 text-2xl">Manage Products</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Update stock and availability -- changes go live on the site
        immediately.
      </p>
      <AdminProductTable initialProducts={products} />
    </main>
  );
}
