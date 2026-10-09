"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { buttonClasses } from "@/components/ui/Button";

// Next.js requires error.tsx to be a Client Component.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for local/dev visibility only — no technical detail is
    // shown to the user (see message below).
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center gap-6 py-24 text-center">
      <AlertTriangle className="h-12 w-12 text-marigold-dark" aria-hidden="true" />
      <h1 className="text-3xl sm:text-4xl">Something went wrong</h1>
      <p className="max-w-sm text-ink-soft">
        That didn&apos;t load correctly. You can try again, or head back to
        the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClasses("primary", "md")}>
          Try again
        </button>
        <Link href="/" className={buttonClasses("secondary", "md")}>
          Back Home
        </Link>
      </div>
    </Container>
  );
}
