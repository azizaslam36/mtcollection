"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Layout";

export function Hero() {
  return (
    <section className="overflow-hidden bg-paper">
      <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-start gap-5"
        >
          <Eyebrow>Product discovery, simplified</Eyebrow>
          <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Find deals worth
            <br />
            your time.
          </h1>
          <p className="max-w-md text-ink-soft">
            M&amp;T Collection curates fashion picks from trusted platforms
            like Flipkart and Myntra, so you spend less time scrolling and
            more time deciding.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products" className={buttonClasses("primary", "lg")}>
              Browse Products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/products?featured=true"
              className={buttonClasses("secondary", "lg")}
            >
              See Today&apos;s Deals
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4"
        >
          <div className="relative aspect-[3/4] translate-y-6 overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/products/black-beige-high-neck-tshirt.jpg"
              alt="Featured high neck T-shirt"
              fill
              sizes="240px"
              className="object-cover"
              priority
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/products/brown-high-neck-sweater.jpg"
              alt="Featured high neck sweater"
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
          <div className="tag-notch absolute -bottom-4 left-1/2 -translate-x-1/2 bg-marigold px-4 py-2 pr-6 text-xs font-semibold uppercase tracking-wide text-ink shadow-card">
            Fresh picks weekly
          </div>
        </motion.div>
      </div>
    </section>
  );
}
