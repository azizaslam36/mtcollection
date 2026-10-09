import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-24 text-center">
      <span className="tag-notch inline-flex items-center bg-mist px-3 py-1.5 pr-5 text-xs font-semibold uppercase tracking-widest text-ink-soft">
        404
      </span>
      <CompassIcon className="h-12 w-12 text-ink-soft" aria-hidden="true" />
      <h1 className="text-3xl sm:text-4xl">This page wandered off</h1>
      <p className="max-w-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist, or the link may be
        out of date.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClasses("primary", "md")}>
          Back Home
        </Link>
        <Link href="/products" className={buttonClasses("secondary", "md")}>
          Browse Products
        </Link>
      </div>
    </Container>
  );
}
