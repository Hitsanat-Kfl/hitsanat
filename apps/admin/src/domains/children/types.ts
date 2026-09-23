import type { Gender } from "../shared/types";

export type KutrGroup = "Kutr 1" | "Kutr 2";
export type CollectionLocation = "Apartama" | "Gende Boy" | "Gende Je" | "Cobalt" | "Bate";
export type ParentRelation = "Father" | "Mother";

export interface Child {
  id: string;
  fullName: string;
  christianName: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  kutrGroup: KutrGroup;
  collectionLocation: CollectionLocation;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Parent {
  id: string;
  fullName: string;
  phoneNumber: string;
  secondaryPhone: string | null;
  address: string;
  occupation: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ChildParent {
  id: string;
  childId: string;
  parentId: string;
  relation: ParentRelation;
  createdAt: string;
}

export interface ParentWithRelation extends Parent {
  relation: ParentRelation;
  childParentId: string;
}

export interface ChildFilters {
  page?: number;
  limit?: number;
  search?: string;
  kutrGroup?: KutrGroup;
  collectionLocation?: CollectionLocation;
}
