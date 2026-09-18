"use client";

import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  globalRoles: string[];
  subDeptRoles: Array<{
    subDepartmentCode: string;
    role: string;
  }>;
}

interface RouteGuardProps {
  children: React.ReactNode;
}

const LEADERSHIP_ROLES = ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"];

/** Sub-dept officer posts that grant admin-portal access (ADR-0007). */
const SUB_DEPT_ACCESS_ROLES = ["Leader", "Sub-Leader", "Secretary"];

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (isMounted) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          }
          return;
        }

        // Extract role from session metadata as initial baseline
        const metadataRole = (session.user.user_metadata?.role as string) || "MEMBER_REGULAR";
        const metadataName =
          (session.user.user_metadata?.name as string) ||
          session.user.email?.split("@")[0] ||
          "User";

        let sessionUser: SessionUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: metadataName,
          role: metadataRole,
          globalRoles: LEADERSHIP_ROLES.includes(metadataRole) ? [metadataRole] : [],
          subDeptRoles: [],
        };

        // Try to fetch full session user from API (with sub-dept scopes)
        try {
          const response = await fetch("/api/v1/auth/session", {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              sessionUser = data.user as SessionUser;
            }
          }
        } catch (apiErr) {
          // If API is unreachable or starting up, proceed with session metadata
          console.warn("API session fetch fallback:", apiErr);
        }

        if (isMounted) {
          setUser(sessionUser);

          // ADR-0007: Non-leader lockout check
          const hasGlobalLeadership = sessionUser.globalRoles.some((role) =>
            LEADERSHIP_ROLES.includes(role)
          );

          const hasSubDeptLeadership = sessionUser.subDeptRoles.some((membership) =>
            SUB_DEPT_ACCESS_ROLES.includes(membership.role)
          );

          if (!hasGlobalLeadership && !hasSubDeptLeadership) {
            setAuthorized(false);
          } else {
            setAuthorized(true);
          }
        }
      } catch {
        if (isMounted) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You do not have permission to access this page.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
