import { describe, expect, it } from "vitest";
import {
  childParentLinkSchema,
  childRegistrationSchema,
  childResponseSchema,
  parentResponseSchema,
  parentSchema,
} from "../src/child.js";

describe("Child Validation Schemas", () => {
  describe("childRegistrationSchema", () => {
    const validChild = {
      fullName: "Little John",
      christianName: "John",
      gender: "Male",
      dateOfBirth: "2018-05-15",
      address: "Addis Ababa",
      kutrGroup: "Kutr 1",
      collectionLocation: "Apartama",
    };

    it("should accept valid child registration", () => {
      const result = childRegistrationSchema.safeParse(validChild);
      expect(result.success).toBe(true);
    });

    it("should accept with optional photoUrl", () => {
      const result = childRegistrationSchema.safeParse({
        ...validChild,
        photoUrl: "https://example.com/photo.jpg",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid kutrGroup", () => {
      const result = childRegistrationSchema.safeParse({
        ...validChild,
        kutrGroup: "Kutr 3",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid collectionLocation", () => {
      const result = childRegistrationSchema.safeParse({
        ...validChild,
        collectionLocation: "Invalid Location",
      });
      expect(result.success).toBe(false);
    });

    it("should accept all valid collection locations", () => {
      const locations = ["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"];
      for (const loc of locations) {
        const result = childRegistrationSchema.safeParse({
          ...validChild,
          collectionLocation: loc,
        });
        expect(result.success).toBe(true);
      }
    });

    it("should accept both kutr groups", () => {
      for (const group of ["Kutr 1", "Kutr 2"]) {
        const result = childRegistrationSchema.safeParse({
          ...validChild,
          kutrGroup: group,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("childResponseSchema", () => {
    it("should accept valid response", () => {
      const result = childResponseSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        fullName: "Little John",
        christianName: "John",
        gender: "Male",
        dateOfBirth: "2018-05-15",
        address: "Addis Ababa",
        kutrGroup: "Kutr 1",
        collectionLocation: "Apartama",
        photoUrl: null,
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("parentSchema", () => {
    it("should accept valid parent data", () => {
      const result = parentSchema.safeParse({
        fullName: "Parent Name",
        phoneNumber: "+251911234567",
        address: "Addis Ababa",
      });
      expect(result.success).toBe(true);
    });

    it("should accept with optional fields", () => {
      const result = parentSchema.safeParse({
        fullName: "Parent Name",
        phoneNumber: "+251911234567",
        secondaryPhone: "+251911234568",
        address: "Addis Ababa",
        occupation: "Teacher",
        notes: "Some notes",
      });
      expect(result.success).toBe(true);
    });

    it("should reject missing fullName", () => {
      const result = parentSchema.safeParse({
        fullName: "",
        phoneNumber: "+251911234567",
        address: "Addis Ababa",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("parentResponseSchema", () => {
    it("should accept valid response", () => {
      const result = parentResponseSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        fullName: "Parent Name",
        phoneNumber: "+251911234567",
        secondaryPhone: null,
        address: "Addis Ababa",
        occupation: null,
        notes: null,
        createdAt: "2024-01-15T10:30:00Z",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("childParentLinkSchema", () => {
    it("should accept valid link", () => {
      const result = childParentLinkSchema.safeParse({
        parentId: "550e8400-e29b-41d4-a716-446655440000",
        relation: "Father",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Mother relation", () => {
      const result = childParentLinkSchema.safeParse({
        parentId: "550e8400-e29b-41d4-a716-446655440000",
        relation: "Mother",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid relation", () => {
      const result = childParentLinkSchema.safeParse({
        parentId: "550e8400-e29b-41d4-a716-446655440000",
        relation: "Sibling",
      });
      expect(result.success).toBe(false);
    });
  });
});
