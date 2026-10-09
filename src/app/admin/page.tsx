"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Eye, EyeOff, Star, TrendingUp, Tag as TagIcon } from "lucide-react";
import { adminListProducts, adminListCategories } from "@/lib/api/admin";

interface Stats {
  total: number;
  published: number;
  unpublished: number;
  featured: number;
  trending: number;
  categories: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [total, published, unpublished, featured, trending, categories] =
          await Promise.all([
            adminListProducts({ limit: 1 }),
            adminListProducts({ limit: 1, active: true }),
            adminListProducts({ limit: 1, active: false }),
            adminListProducts({ limit: 1, featured: true }),
            adminListProducts({ limit: 1, trending: true }),
            adminListCategories(),
          ]);
        setStats({
          total: total.pagination.total,
          published: published.pagination.total,
          unpublished: unpublished.pagination.total,
          featured: featured.pagination.total,
          trending: trending.pagination.total,
          categories: categories.length,
        });
      } catch {
        setError("Could not load dashboard stats.");
      }
    }
    load();
  }, []);

  const cards = stats
    ? [
        { label: "Total products", value: stats.total, icon: Package },
        { label: "Published", value: stats.published, icon: Eye },
        { label: "Unpublished", value: stats.unpublished, icon: EyeOff },
        { label: "Featured", value: stats.featured, icon: Star },
        { label: "Trending", value: stats.trending, icon: TrendingUp },
        { label: "Categories", value: stats.categories, icon: TagIcon },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl">Dashboard</h1>

      {error ? <p className="text-sm text-ink-soft">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-card border border-mist bg-white p-5"
          >
            <span className="rounded-tag bg-mist p-3 text-ink">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-ink">{value}</p>
              <p className="text-sm text-ink-soft">{label}</p>
            </div>
          </div>
        ))}
        {!stats && !error ? (
          <p className="text-sm text-ink-soft">Loading stats…</p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/products/new"
          className="rounded-tag bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-marigold hover:text-ink"
        >
          Add Product
        </Link>
        <Link
          href="/admin/categories/new"
          className="rounded-tag border border-ink px-4 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
        >
          Add Category
        </Link>
      </div>
    </div>
  );
}
