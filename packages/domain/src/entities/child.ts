import type { BaseEntity } from "../base.js";
import type { Gender } from "./member.js";

export enum KutrGroup {
  KUTR_1 = "Kutr 1",
  KUTR_2 = "Kutr 2",
}

export enum CollectionLocation {
  APARTAMA = "Apartama",
  GENDE_BOY = "Gende Boy",
  GENDE_JE = "Gende Je",
  COBALT = "Cobalt",
  BATE = "Bate",
}

export interface Child extends BaseEntity {
  fullName: string;
  christianName: string;
  gender: Gender;
  dateOfBirth: Date;
  address: string;
  kutrGroup: KutrGroup;
  collectionLocation: CollectionLocation;
  photoUrl?: string;
  isActive: boolean;
}

export interface Parent extends BaseEntity {
  fullName: string;
  phoneNumber: string;
  secondaryPhone?: string;
  address: string;
  occupation?: string;
  notes?: string;
}

export interface ChildParent extends BaseEntity {
  childId: string;
  parentId: string;
  relation: "Father" | "Mother";
}

export type CreateChild = Omit<Child, "id" | "createdAt">;
export type UpdateChild = Partial<Omit<Child, "id" | "createdAt">>;
export type CreateParent = Omit<Parent, "id" | "createdAt">;
export type UpdateParent = Partial<Omit<Parent, "id" | "createdAt">>;
