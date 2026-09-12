import type { Request, Response } from "express";

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Hitsanat Kifl API",
    version: "1.0.0",
    description: "API for Hitsanat Kifl Children's Ministry Management System",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
    {
      url: "/",
      description: "Root",
    },
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Session cookie from Better Auth",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "Bearer token from Authorization header",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "string",
                example: "AUTH_UNAUTHORIZED",
              },
              message: {
                type: "string",
                example: "Authentication required",
              },
            },
          },
        },
        required: ["success", "error"],
      },
      SessionUser: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          email: {
            type: "string",
            format: "email",
          },
          name: {
            type: "string",
          },
          role: {
            type: "string",
            enum: ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY", "MEMBER_REGULAR"],
          },
          image: {
            type: "string",
            nullable: true,
          },
          globalRoles: {
            type: "array",
            items: {
              type: "string",
            },
          },
          subDeptRoles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                subDepartmentCode: {
                  type: "string",
                },
                role: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      Member: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string", example: "Daniel Kebede" },
          christianName: { type: "string", example: "Daniel" },
          phoneNumber: { type: "string", example: "+251911000001" },
          yearOfStudy: {
            type: "string",
            enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "GC"],
          },
          academicDepartment: { type: "string", example: "Computer Science" },
          campus: { type: "string", example: "Main Campus" },
          gender: { type: "string", enum: ["Male", "Female"] },
          photoUrl: { type: "string", nullable: true },
          telegramUsername: { type: "string", nullable: true },
          dateJoined: { type: "string", format: "date-time" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Family: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          familyName: { type: "string", example: "Tsige Family" },
          fatherMemberId: { type: "string", format: "uuid", nullable: true },
          motherMemberId: { type: "string", format: "uuid", nullable: true },
          academicYear: { type: "string", example: "2016 E.C." },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      SubDepartment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          code: { type: "string", enum: ["TIMIHRT", "MEZMUR", "KUTITR", "EKD", "KINETIBEB"] },
          nameAm: { type: "string", example: "ትምህርት" },
          nameEn: { type: "string", example: "Timihrt" },
          description: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      SubDepartmentMember: {
        type: "object",
        properties: {
          memberId: { type: "string", format: "uuid" },
          memberName: { type: "string" },
          christianName: { type: "string" },
          role: { type: "string", example: "LEAD" },
          isPrimary: { type: "boolean" },
          assignedAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedMembers: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Member" },
          },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              total: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
        },
      },
      Child: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string", example: "Kidist Mulugeta" },
          christianName: { type: "string", example: "Kidist" },
          gender: { type: "string", enum: ["Male", "Female"] },
          dateOfBirth: { type: "string", format: "date" },
          address: { type: "string", example: "Bole, Addis Ababa" },
          kutrGroup: { type: "string", enum: ["Kutr 1", "Kutr 2"], description: "BR-012" },
          collectionLocation: {
            type: "string",
            enum: ["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"],
            description: "BR-013",
          },
          photoUrl: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Parent: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string", example: "Mulugeta Tesfaye" },
          phoneNumber: { type: "string", example: "+251911000010" },
          secondaryPhone: { type: "string", nullable: true },
          address: { type: "string", example: "Bole, Addis Ababa" },
          occupation: { type: "string", nullable: true },
          notes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ChildParent: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          childId: { type: "string", format: "uuid" },
          parentId: { type: "string", format: "uuid" },
          relation: { type: "string", enum: ["Father", "Mother"], description: "BR-010" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ParentWithRelation: {
        allOf: [
          { $ref: "#/components/schemas/Parent" },
          {
            type: "object",
            properties: {
              relation: { type: "string", enum: ["Father", "Mother"] },
              childParentId: { type: "string", format: "uuid" },
            },
          },
        ],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "API Health Check",
        description: "Returns health and service status of the API",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                    service: {
                      type: "string",
                      example: "hitsanat-api",
                    },
                    version: {
                      type: "string",
                      example: "1.0.0",
                    },
                    environment: {
                      type: "string",
                      example: "development",
                    },
                  },
                  required: ["status", "timestamp", "service", "version", "environment"],
                },
              },
            },
          },
        },
      },
    },
    "/auth/sign-in/email": {
      post: {
        summary: "Sign in with email and password",
        description: "Authenticates a user with email and password, creates a session cookie",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "securePassword123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Sign in successful",
            headers: {
              "Set-Cookie": {
                description: "Session cookie",
                schema: {
                  type: "string",
                },
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    user: {
                      $ref: "#/components/schemas/SessionUser",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded",
          },
        },
      },
    },
    "/auth/sign-up/email": {
      post: {
        summary: "Sign up with email and password",
        description: "Creates a new user account with email and password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "newuser@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    example: "securePassword123",
                  },
                  name: {
                    type: "string",
                    example: "John Doe",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Sign up successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    user: {
                      $ref: "#/components/schemas/SessionUser",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid input or user already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded",
          },
        },
      },
    },
    "/auth/sign-out": {
      post: {
        summary: "Sign out",
        description: "Invalidates the current session and clears the session cookie",
        tags: ["Authentication"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        responses: {
          "200": {
            description: "Sign out successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/session": {
      get: {
        summary: "Get current session",
        description: "Returns the current authenticated user's session and role information",
        tags: ["Authentication"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        responses: {
          "200": {
            description: "Session retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    user: {
                      $ref: "#/components/schemas/SessionUser",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Not authenticated or session expired",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/members": {
      get: {
        summary: "List members",
        description: "Returns paginated list of members with optional filtering",
        tags: ["Members"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Search by name or phone",
          },
          {
            name: "subDept",
            in: "query",
            schema: { type: "string", format: "uuid" },
            description: "Filter by sub-department ID",
          },
          {
            name: "familyId",
            in: "query",
            schema: { type: "string", format: "uuid" },
            description: "Filter by family ID",
          },
          {
            name: "yearOfStudy",
            in: "query",
            schema: { type: "string" },
            description: "Filter by year of study",
          },
          {
            name: "isActive",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
            description: "Filter by active status",
          },
        ],
        responses: {
          "200": {
            description: "Paginated member list",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/PaginatedMembers" } },
            },
          },
        },
      },
    },
    "/members/{id}": {
      get: {
        summary: "Get member detail",
        description: "Returns a single member by ID",
        tags: ["Members"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Member found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Member" },
                  },
                },
              },
            },
          },
          "404": { description: "Member not found" },
        },
      },
      put: {
        summary: "Update member",
        description: "Updates member fields (name, phone, year, department, etc.)",
        tags: ["Members"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string" },
                  christianName: { type: "string" },
                  phoneNumber: { type: "string" },
                  yearOfStudy: { type: "string" },
                  academicDepartment: { type: "string" },
                  campus: { type: "string" },
                  gender: { type: "string", enum: ["Male", "Female"] },
                  photoUrl: { type: "string", nullable: true },
                  telegramUsername: { type: "string", nullable: true },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Member updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Member" },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid input or phone already in use" },
          "404": { description: "Member not found" },
        },
      },
    },
    "/members/stage1": {
      post: {
        summary: "Create member (Stage 1)",
        description: "Fast initial member creation with 7 mandatory fields (BR-001)",
        tags: ["Members"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "fullName",
                  "christianName",
                  "phoneNumber",
                  "yearOfStudy",
                  "academicDepartment",
                  "campus",
                  "gender",
                ],
                properties: {
                  fullName: { type: "string" },
                  christianName: { type: "string" },
                  phoneNumber: { type: "string" },
                  yearOfStudy: { type: "string" },
                  academicDepartment: { type: "string" },
                  campus: { type: "string" },
                  gender: { type: "string", enum: ["Male", "Female"] },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Member created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Member" },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid input or phone number already exists" },
        },
      },
    },
    "/members/{id}/stage2": {
      patch: {
        summary: "Update member (Stage 2)",
        description:
          "Enriches member with sub-department assignments, family link, photo, telegram",
        tags: ["Members"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["subDepartmentIds"],
                properties: {
                  subDepartmentIds: {
                    type: "array",
                    items: { type: "string", format: "uuid" },
                    minItems: 1,
                  },
                  familyId: { type: "string", format: "uuid" },
                  photoUrl: { type: "string", format: "url" },
                  telegramUsername: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Member enriched" },
          "400": { description: "Invalid input or member already in sub-department" },
          "404": { description: "Member not found" },
        },
      },
    },
    "/families": {
      get: {
        summary: "List families",
        description: "Returns paginated list of families",
        tags: ["Families"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Paginated family list" },
        },
      },
      post: {
        summary: "Create family",
        description: "Creates a new family unit with optional father/mother assignment (BR-004)",
        tags: ["Families"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["familyName", "academicYear"],
                properties: {
                  familyName: { type: "string", example: "Tsige Family" },
                  fatherMemberId: { type: "string", format: "uuid" },
                  motherMemberId: { type: "string", format: "uuid" },
                  academicYear: { type: "string", example: "2016 E.C." },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Family created" },
          "400": { description: "Invalid input" },
        },
      },
    },
    "/families/{id}": {
      get: {
        summary: "Get family detail",
        description: "Returns a single family by ID",
        tags: ["Families"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": { description: "Family found" },
          "404": { description: "Family not found" },
        },
      },
    },
    "/sub-departments": {
      get: {
        summary: "List sub-departments",
        description: "Returns all 5 ministry sub-departments (FR-03.1)",
        tags: ["Sub-Departments"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of sub-departments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SubDepartment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/sub-departments/{code}/roster": {
      get: {
        summary: "Get sub-department roster",
        description:
          "Returns members assigned to a sub-department with their scoped roles (FR-03.2)",
        tags: ["Sub-Departments"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["TIMIHRT", "MEZMUR", "KUTITR", "EKD", "KINETIBEB"] },
          },
        ],
        responses: {
          "200": {
            description: "Sub-department roster",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SubDepartmentMember" },
                    },
                  },
                },
              },
            },
          },
          "404": { description: "Sub-department not found" },
        },
      },
    },
    "/children": {
      post: {
        summary: "Register a new child",
        description:
          "Creates a child record with Kutr group and collection location (FR-04.1, BR-012, BR-013)",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "fullName",
                  "christianName",
                  "gender",
                  "dateOfBirth",
                  "address",
                  "kutrGroup",
                  "collectionLocation",
                ],
                properties: {
                  fullName: { type: "string", example: "Kidist Mulugeta" },
                  christianName: { type: "string", example: "Kidist" },
                  gender: { type: "string", enum: ["Male", "Female"] },
                  dateOfBirth: { type: "string", format: "date", example: "2018-06-15" },
                  address: { type: "string", example: "Bole, Addis Ababa" },
                  kutrGroup: { type: "string", enum: ["Kutr 1", "Kutr 2"], description: "BR-012" },
                  collectionLocation: {
                    type: "string",
                    enum: ["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"],
                    description: "BR-013",
                  },
                  photoUrl: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Child registered" },
          "400": { description: "Validation error" },
        },
      },
      get: {
        summary: "List children",
        description: "Returns paginated list of children with optional filters",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "kutrGroup",
            in: "query",
            schema: { type: "string", enum: ["Kutr 1", "Kutr 2"] },
          },
          {
            name: "collectionLocation",
            in: "query",
            schema: {
              type: "string",
              enum: ["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of children",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Child" } },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/children/{id}": {
      get: {
        summary: "Get child detail",
        description: "Returns child with parents and assignments",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": { description: "Child found" },
          "404": { description: "Child not found" },
        },
      },
      patch: {
        summary: "Update child",
        description: "Updates child information",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          "200": { description: "Child updated" },
          "404": { description: "Child not found" },
        },
      },
      delete: {
        summary: "Delete child",
        description: "Soft-deletes a child record",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "204": { description: "Child deleted" },
          "404": { description: "Child not found" },
        },
      },
    },
    "/children/{id}/reclassify": {
      patch: {
        summary: "Reclassify child Kutr group",
        description: "Changes child from Kutr 1 to Kutr 2 or vice versa",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["kutrGroup"],
                properties: {
                  kutrGroup: { type: "string", enum: ["Kutr 1", "Kutr 2"] },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Child reclassified" },
          "404": { description: "Child not found" },
        },
      },
    },
    "/children/birthdays/{month}": {
      get: {
        summary: "Find children by birthday month",
        description: "Returns all active children born in the specified month",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "month",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1, maximum: 12 },
          },
        ],
        responses: {
          "200": {
            description: "Children with birthdays in specified month",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Child" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/children/{id}/parents": {
      get: {
        summary: "List parents for a child",
        description: "Returns parents linked to a child with relation type",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Parents linked to child",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ParentWithRelation" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Link parent to child",
        description:
          "Links a parent to a child with relation type (BR-010: max 1 Father, 1 Mother)",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["parentId", "relation"],
                properties: {
                  parentId: { type: "string", format: "uuid" },
                  relation: { type: "string", enum: ["Father", "Mother"], description: "BR-010" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Parent linked" },
          "400": { description: "Duplicate relation or parent already linked" },
          "404": { description: "Child or parent not found" },
        },
      },
    },
    "/children/{id}/parents/{parentId}": {
      delete: {
        summary: "Unlink parent from child",
        description: "Removes the parent-child link",
        tags: ["Children"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          {
            name: "parentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Parent unlinked" },
          "404": { description: "Child or link not found" },
        },
      },
    },
    "/children/parents": {
      post: {
        summary: "Create a parent",
        description: "Creates a new parent record",
        tags: ["Parents"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "phoneNumber", "address"],
                properties: {
                  fullName: { type: "string", example: "Mulugeta Tesfaye" },
                  phoneNumber: { type: "string", example: "+251911000010" },
                  secondaryPhone: { type: "string" },
                  address: { type: "string", example: "Bole, Addis Ababa" },
                  occupation: { type: "string", example: "Engineer" },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Parent created" },
          "400": { description: "Validation error" },
        },
      },
      get: {
        summary: "List all parents",
        description: "Returns all parent records",
        tags: ["Parents"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of parents",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Parent" } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export function swaggerJsonHandler(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");
  res.send(openApiSpec);
}
