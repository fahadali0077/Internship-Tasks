import type { Metadata } from "next";
import { ADMIN_PRODUCTS } from "@/lib/adminData";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Products — Admin" };

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-normal dark:text-white">Products</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Sort by price or stock · Filter by category · 8 per page
        </p>
      </div>
      <ProductsTable products={ADMIN_PRODUCTS} />
    </div>
  );
}
