"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import type { Category } from "@/types/category";

interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({
  links,
  categories,
}: {
  links: NavLink[];
  categories: Category[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close the drawer whenever navigation happens.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape, focus the close button on open for keyboard users.
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-drawer"
        className="inline-flex rounded-tag p-2 hover:bg-white/10 lg:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-ink/60 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              id="mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-xs flex-col overflow-y-auto bg-ink text-paper lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-display text-lg">Menu</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="rounded-tag p-2 hover:bg-white/10"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <Link
                href="/search"
                className="mx-5 mb-2 flex items-center gap-2 rounded-tag border border-white/15 px-3 py-2 text-sm text-paper/80"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search products
              </Link>

              <nav aria-label="Mobile primary" className="flex flex-col px-5 py-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-white/10 py-3 text-base"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col px-5 py-2">
                <span className="pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-paper/50">
                  Categories
                </span>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="py-2 text-sm text-paper/80"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
