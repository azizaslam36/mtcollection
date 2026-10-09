import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { getAllCategories } from "@/data/categories";
import { MobileMenu } from "./MobileMenu";
import { CategoriesDropdown } from "./CategoriesDropdown";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products?featured=true", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const categories = await getAllCategories();

  return (
    <header className="sticky top-0 z-40 bg-ink text-paper">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/brand/logo.png"
            alt="M&T Collection"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-display text-lg leading-none">
            M&amp;T Collection
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-sm font-medium lg:flex"
        >
          <Link href="/" className="hover:text-marigold">
            Home
          </Link>
          <Link href="/products" className="hover:text-marigold">
            Products
          </Link>
          <CategoriesDropdown categories={categories} />
          <Link href="/products?featured=true" className="hover:text-marigold">
            Deals
          </Link>
          <Link href="/about" className="hover:text-marigold">
            About
          </Link>
          <Link href="/contact" className="hover:text-marigold">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search products"
            className="hidden rounded-tag p-2 hover:bg-white/10 sm:inline-flex"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <MobileMenu links={NAV_LINKS} categories={categories} />
        </div>
      </div>
    </header>
  );
}
