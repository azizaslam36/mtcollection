"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import { buttonClasses } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await adminLogin(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not reach the server. Is the backend running?"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-card border border-mist bg-white p-8 shadow-card"
      >
        <h1 className="font-display text-2xl text-ink">M&amp;T Admin</h1>
        <p className="text-sm text-ink-soft">Sign in to manage products and categories.</p>

        {error ? (
          <p role="alert" className="rounded-tag bg-marigold/20 px-3 py-2 text-sm text-ink">
            {error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-tag border border-mist px-3 py-2 focus-visible:ring-2 focus-visible:ring-marigold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-tag border border-mist px-3 py-2 focus-visible:ring-2 focus-visible:ring-marigold"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClasses("primary", "md", "mt-2")}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
