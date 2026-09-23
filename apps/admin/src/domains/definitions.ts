// ============================================================
// Domain definitions facade — @/domains/definitions
// ============================================================
// Compatibility re-export surface that preserves the previous
// `@/lib/types` import contract while the physical type
// definitions now live in their domain modules below.
//
// New code should import from the specific domain barrel
// (e.g. `@/domains/members`); this facade exists so the
// migration stays incremental without a big-bang rewrite.
// ============================================================

export * from "./shared/types";
export * from "./members/types";
export * from "./children/types";
export * from "./sub-departments/types";
export * from "./planning/types";
export * from "./attendance/types";
export * from "./reports/types";
export * from "./events/types";
export * from "./communications/types";
export * from "./academic/types";
