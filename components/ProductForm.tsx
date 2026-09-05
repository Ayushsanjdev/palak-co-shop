"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  category: string;
  material: string;
  color: string;
  size: string;
  pattern: string;
  price: string; // rupees, as typed -- converted to paise on submit
  originalPrice: string; // rupees, optional
  stock: string;
  imageUrl: string;
}

interface ProductFormProps {
  initial: ProductFormValues;
  mode: "create" | "edit";
}

const inputClass = "w-full border px-4 py-3 text-base";
const inputStyle = {
  borderColor: "var(--color-line)",
  borderRadius: "var(--radius-card)",
};
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export default function ProductForm({ initial, mode }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [imagePreview, setImagePreview] = useState(initial.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(
    key: K,
    v: ProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show a preview right away (before upload finishes) so it never
    // feels like nothing happened after picking a photo.
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      set("imageUrl", data.url);
    } catch {
      setError("Photo upload didn't work. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.name.trim() || !values.category.trim() || !values.price) {
      setError("Please fill in the bag's name, category, and price.");
      return;
    }
    if (!values.imageUrl) {
      setError("Please add a photo of the bag.");
      return;
    }

    setSaving(true);

    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      material: values.material.trim() || null,
      color: values.color.trim() || null,
      size: values.size.trim() || null,
      pattern: values.pattern.trim() || null,
      price: Math.round(Number(values.price) * 100),
      originalPrice: values.originalPrice
        ? Math.round(Number(values.originalPrice) * 100)
        : null,
      stock: Number(values.stock) || 0,
      imageUrl: values.imageUrl,
    };

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${values.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong saving this bag. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Photo</label>
        <div className="flex items-center gap-4">
          <div
            className="relative h-24 w-24 shrink-0 overflow-hidden bg-[var(--color-surface)]"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            {imagePreview && (
              <Image
                src={imagePreview}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <label
            className="cursor-pointer border px-4 py-2 text-sm font-medium"
            style={inputStyle}
          >
            {uploading ? "Uploading..." : "Choose photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Bag name</label>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Canvas Tote"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <input
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="e.g. Tote, Sling, Travel"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Material (optional)</label>
          <input
            value={values.material}
            onChange={(e) => set("material", e.target.value)}
            placeholder="e.g. Canvas, Leather, Jute"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass}>Color (optional)</label>
          <input
            value={values.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="e.g. Brown, Black"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Size (optional)</label>
          <input
            value={values.size}
            onChange={(e) => set("size", e.target.value)}
            placeholder="e.g. Small, Medium, Large"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass}>Design (optional)</label>
          <input
            value={values.pattern}
            onChange={(e) => set("pattern", e.target.value)}
            placeholder="e.g. Plain, Printed, Woven"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description (optional)</label>
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (₹)</label>
          <input
            type="number"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="799"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass}>Sale price before (optional)</label>
          <input
            type="number"
            value={values.originalPrice}
            onChange={(e) => set("originalPrice", e.target.value)}
            placeholder="999"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>How many in stock</label>
        <input
          type="number"
          value={values.stock}
          onChange={(e) => set("stock", e.target.value)}
          placeholder="10"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full py-4 text-base font-medium text-white disabled:opacity-50"
        style={{
          background: "var(--color-accent)",
          borderRadius: "var(--radius-card)",
        }}
      >
        {saving
          ? "Saving..."
          : mode === "create"
            ? "Add this bag"
            : "Save changes"}
      </button>
    </form>
  );
}
