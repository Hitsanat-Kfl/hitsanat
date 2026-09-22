"use client";

import { Breadcrumb, type BreadcrumbItem, Button, EmptyState, Spinner } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import type * as React from "react";

// === Shared Page Patterns ===

interface AlertBannerProps {
  message: string;
  className?: string;
}

export function AlertBanner({ message, className }: AlertBannerProps) {
  return (
    <div
      className={cn("rounded-md bg-destructive/10 p-3 text-sm text-destructive", className)}
      role="alert"
    >
      {message}
    </div>
  );
}

interface PageLoadingProps {
  className?: string;
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Spinner size="lg" />
    </div>
  );
}

interface PageEmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

export function PageEmpty({
  title = "No items found",
  description = "There are no items to display.",
  className,
}: PageEmptyProps) {
  return <EmptyState title={title} description={description} className={className} />;
}

interface PagePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PagePagination({ page, totalPages, onPageChange, className }: PagePaginationProps) {
  if (totalPages <= 0) return null;

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

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
        className={cn("mx-auto py-2 px-1 sm:px-2 lg:px-3", fullWidth ? "max-w-full" : "max-w-7xl")}
      >
        {hasHeader && (
          <header className="mb-4 space-y-3">
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
