import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);
  if (!admin) redirect("/");

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="font-display mb-6 text-2xl">Edit Bag</h1>
      <ProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          material: product.material ?? "",
          color: product.color ?? "",
          size: product.size ?? "",
          pattern: product.pattern ?? "",
          price: (product.price / 100).toString(),
          originalPrice: product.originalPrice
            ? (product.originalPrice / 100).toString()
            : "",
          stock: product.stock.toString(),
          imageUrl: product.imageUrl,
        }}
      />
    </main>
  );
}
