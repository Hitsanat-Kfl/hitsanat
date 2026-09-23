// ============================================================
// Shared domain primitives used across multiple domains.
// Only genuinely cross-domain types belong here.
// ============================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type Gender = "Male" | "Female";
