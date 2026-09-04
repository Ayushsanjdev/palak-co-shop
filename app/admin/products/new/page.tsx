import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);
  if (!admin) redirect("/");

  return (
    <main className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="font-display mb-6 text-2xl">Add a New Bag</h1>
      <ProductForm
        mode="create"
        initial={{
          name: "",
          description: "",
          category: "",
          price: "",
          originalPrice: "",
          stock: "",
          imageUrl: "",
        }}
      />
    </main>
  );
}
