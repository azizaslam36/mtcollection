import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/category";

export function CategoryCard({
  category,
  productCount,
}: {
  category: Category;
  productCount: number;
}) {
  const isExternal = category.image?.startsWith("http");

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-card shadow-card"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          unoptimized={isExternal}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-mist" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="relative flex w-full items-center justify-between p-4 text-paper">
        <span className="font-display text-lg">{category.name}</span>
        <span className="text-xs text-paper/70">
          {productCount} {productCount === 1 ? "item" : "items"}
        </span>
      </div>
    </Link>
  );
}
