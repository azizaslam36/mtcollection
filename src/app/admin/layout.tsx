"use client";

/**
 * This entire layout — and every page under /admin — is a Client
 * Component tree. That's a deliberate architecture choice, not an
 * oversight: the Express backend's auth cookie is httpOnly and scoped
 * to the API's own origin (NEXT_PUBLIC_API_URL), so it is only ever
 * present in the BROWSER's cookie jar — a Next.js Server Component
 * rendering on the Node server during SSR has no access to it. The
 * only way to check "is this admin logged in" and to make
 * authenticated requests is from code that actually runs in the
 * browser, i.e. Client Components. This matches the Stage 3 spec's
 * own guidance (#21): "Client components should only handle
 * interactive UI... authentication, admin functionality" are named
 * as expected client-side concerns.
 *
 * /admin/login is intentionally excluded from the auth check below
 * (it's the one admin page an unauthenticated visitor must reach).
 */
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const auth = useAdminAuth(!isLoginPage);

  if (isLoginPage) {
    return <div className="min-h-screen bg-paper">{children}</div>;
  }

  if (auth.status === "unconfigured") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        <div className="max-w-md">
          <h1 className="mb-2 text-2xl">Backend not configured</h1>
          <p className="text-ink-soft">
            The admin panel needs NEXT_PUBLIC_API_URL set (see .env.example)
            and the backend server running before you can log in.
          </p>
        </div>
      </div>
    );
  }

  if (auth.status === "loading" || auth.status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-ink-soft">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav email={auth.admin.email} />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
