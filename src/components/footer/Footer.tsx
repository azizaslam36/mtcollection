import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone } from "lucide-react";
import { getAllCategories } from "@/data/categories";

export async function Footer() {
  const categories = await getAllCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/brand/logo.png"
              alt="M&T Collection"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-lg">M&amp;T Collection</span>
          </div>
          <p className="max-w-xs text-sm text-paper/70">
            An affiliate product discovery platform — we surface deals from
            trusted platforms like Flipkart and Myntra, alongside our own
            self-branded products.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-paper/50">
            Navigate
          </h3>
          <Link href="/" className="text-sm text-paper/80 hover:text-marigold">
            Home
          </Link>
          <Link href="/products" className="text-sm text-paper/80 hover:text-marigold">
            Products
          </Link>
          <Link href="/about" className="text-sm text-paper/80 hover:text-marigold">
            About
          </Link>
          <Link href="/contact" className="text-sm text-paper/80 hover:text-marigold">
            Contact
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-paper/50">
            Categories
          </h3>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm text-paper/80 hover:text-marigold"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-paper/50">
            Contact
          </h3>
          <a
            href="https://wa.me/919911999482"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-paper/80 hover:text-marigold"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            +91 99119 99482
          </a>
          <a
            href="https://www.instagram.com/mtcollection.01"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-paper/80 hover:text-marigold"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            @mtcollection.01
          </a>
          <span className="flex items-start gap-2 text-sm text-paper/80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Jamia Nagar, Okhla, New Delhi 110025
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-page text-center text-xs text-paper/50">
          © {year} M&amp;T Collection. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
