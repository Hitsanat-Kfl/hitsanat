"use client";

import type * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/v1/auth/session", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const data = await response.json();

        if (!data.success || !data.user) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const sessionUser = data.user as SessionUser;
        setUser(sessionUser);

        // ADR-0007: Non-leader lockout
        // Check if user has any leadership role (global or sub-department)
        const hasGlobalLeadership = sessionUser.globalRoles.some((role) =>
          LEADERSHIP_ROLES.includes(role)
        );

        const hasSubDeptLeadership = sessionUser.subDeptRoles.some((membership) =>
          ["LEAD", "ADMIN"].includes(membership.role)
        );

        if (!hasGlobalLeadership && !hasSubDeptLeadership) {
          // Regular members without leadership roles are denied access
          setAuthorized(false);
          return;
        }

        setAuthorized(true);
      } catch {
        // Session check failed, redirect to login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Refresh session on navigation
  useEffect(() => {
    if (user) {
      const refreshSession = async () => {
        try {
          await fetch("/api/v1/auth/session", {
            credentials: "include",
          });
        } catch {
          // Silent fail for session refresh
        }
      };

      refreshSession();
    }
  }, [user]);

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
