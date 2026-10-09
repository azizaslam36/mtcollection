"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminMe, type AdminSession } from "@/lib/api/admin";
import { isApiConfigured } from "@/lib/api/client";

type AuthState =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; admin: AdminSession };

/**
 * Client-side session check against the backend. This can't be done
 * in a Server Component: the auth cookie is httpOnly on the API's own
 * origin, so only a fetch executed in the BROWSER (which is what a
 * Client Component's useEffect does) carries it. See src/lib/api/admin.ts
 * header comment for the same point.
 */
export function useAdminAuth(redirectToLogin = true) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    if (!isApiConfigured()) {
      setState({ status: "unconfigured" });
      return;
    }

    let cancelled = false;
    adminMe()
      .then((admin) => {
        if (!cancelled) setState({ status: "authenticated", admin });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "unauthenticated" });
          if (redirectToLogin) router.replace("/admin/login");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router, redirectToLogin]);

  return state;
}
