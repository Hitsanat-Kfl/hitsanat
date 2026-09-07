"use client";

import type * as React from "react";
import { Breadcrumb, type BreadcrumbItem, Button, Separator } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

interface PageShellProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageShell({
  breadcrumbs,
  title,
  description,
  actions,
  children,
  className,
  fullWidth = false,
}: PageShellProps) {
  const hasHeader = breadcrumbs || title || description || actions;

  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <div
        className={cn("mx-auto py-6 px-4 sm:px-6 lg:px-8", fullWidth ? "max-w-full" : "max-w-7xl")}
      >
        {hasHeader && (
          <header className="mb-6 space-y-4">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

            {(title || actions) && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  {title && (
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                      {title}
                    </h1>
                  )}
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            )}
          </header>
        )}

        <main>{children}</main>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
