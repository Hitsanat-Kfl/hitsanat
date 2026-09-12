"use client";

import { Button } from "@repo/ui";
import type { Pagination } from "../../lib/types";

interface ChildPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function ChildPagination({ pagination, onPageChange }: ChildPaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, total)} of{" "}
        {total} children
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
