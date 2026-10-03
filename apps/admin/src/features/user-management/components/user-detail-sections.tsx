import { cn } from "@repo/ui/lib/utils";
import type * as React from "react";

/**
 * Shared building blocks for the account dossier.
 *
 * They deliberately mirror the User Accounts directory: the same white
 * surfaces, thin `#E5E7EB` rules, 8px radius and compact uppercase panel
 * titles, so both screens read as one product.
 */

interface PanelProps extends React.ComponentPropsWithoutRef<"section"> {
  /** Heading id the panel is labelled by. */
  titleId?: string;
}

export function Panel({ titleId, className, children, ...props }: PanelProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-lg border border-[#E5E7EB] bg-white p-4 md:p-5", className)}
      {...props}
    >
      {children}
    </section>
  );
}

interface SectionTitleProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ id, children, className }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function FieldList({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return <dl className={cn("mt-3", className)}>{children}</dl>;
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

/**
 * One label/value row. Stacked on phones so long emails and timestamps stay
 * readable, and split into two columns from `sm` up.
 */
export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="border-b border-[#F1F3F5] py-2.5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <dt className="text-[13px] text-muted-foreground">{label}</dt>
        <dd className="min-w-0 max-w-full break-all text-left text-sm text-foreground sm:text-right">
          {children}
        </dd>
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Compact label-over-value cell used by the identity metadata strip. */
export function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}
