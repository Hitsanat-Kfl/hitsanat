import type { PermissionGrant } from "@repo/permissions";

export type { PermissionGrant };

export interface CreatePermissionGrantRecord {
  userId: string;
  resource: string;
  action: string;
  expiresAt: Date;
  reason?: string | null;
}

export interface PermissionGrantQuery {
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface PermissionGrantPage {
  entries: PermissionGrant[];
  total: number;
}

export interface PermissionGrantRepository {
  create(record: CreatePermissionGrantRecord, grantedBy: string): Promise<PermissionGrant>;
  findMany(query?: PermissionGrantQuery): Promise<PermissionGrantPage>;
  findById(id: string): Promise<PermissionGrant | null>;
  revoke(id: string, revokedBy: string, now?: Date): Promise<PermissionGrant>;
}
