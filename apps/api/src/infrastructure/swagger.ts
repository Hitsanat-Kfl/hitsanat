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
      AnnualMasterPlan: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          academicYear: { type: "string", example: "2026-2027" },
          title: { type: "string", example: "Annual Master Plan 2026" },
          totalBudget: { type: "number", description: "Sum of all activity budgets" },
          totalPeople: { type: "integer", description: "Sum of all human resources" },
          totalTime: { type: "number", description: "Sum of all planned times (hours)" },
          status: {
            type: "string",
            enum: ["Draft", "Distributed", "Active", "Completed", "Archived"],
          },
          createdBy: { type: "string" },
          approvedBy: { type: "string", nullable: true },
          approvedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PlanGoal: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          annualPlanId: { type: "string", format: "uuid" },
          goalNumber: { type: "integer" },
          title: { type: "string", example: "Spiritual Growth" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PlanActivity: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          planGoalId: { type: "string", format: "uuid" },
          activityNumber: { type: "integer" },
          mainActivity: { type: "string", example: "Bible Study Sessions" },
          expectedResult: { type: "string", nullable: true },
          annualTarget: { type: "integer" },
          budget: { type: "number", description: "Budget in ETB" },
          humanResource: { type: "integer", description: "Number of people required" },
          plannedTime: { type: "number", description: "Time in hours" },
          weight: { type: "number", description: "Calculated weight percentage (BR-030)" },
          q1Target: { type: "integer", description: "Q1 quarterly target" },
          q2Target: { type: "integer", description: "Q2 quarterly target" },
          q3Target: { type: "integer", description: "Q3 quarterly target" },
          q4Target: { type: "integer", description: "Q4 quarterly target" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PlanDistribution: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          planActivityId: { type: "string", format: "uuid" },
          subDepartmentId: { type: "string" },
          status: { type: "string", enum: ["Assigned", "In_Progress", "Completed"] },
          assignedAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      WeeklyPlan: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          planDistributionId: { type: "string", format: "uuid" },
          ethiopianMonth: { type: "string", example: "Meskerem" },
          weekNumber: { type: "integer" },
          sessionDate: { type: "string", format: "date-time" },
          taskDescription: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PlanProgressRecord: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          weeklyPlanId: { type: "string", format: "uuid" },
          actualResultNumeric: { type: "number", nullable: true },
          actualResultText: { type: "string", nullable: true },
          status: { type: "string", enum: ["Assigned", "In_Progress", "Completed"] },
          challenges: { type: "string", nullable: true },
          submittedBy: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AcademicAssessment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          curriculumId: { type: "string", format: "uuid" },
          assessmentType: {
            type: "string",
            enum: ["Mid_Exam", "Final_Exam", "Quiz", "Assignment"],
            description: "FR-07.1: Assessment type (Mid_Exam, Final_Exam, Quiz, Assignment)",
          },
          subjectTopic: { type: "string" },
          maxScore: { type: "number", description: "Maximum score for the assessment" },
          academicPeriod: { type: "string" },
          examDate: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      StudentScore: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          academicAssessmentId: { type: "string", format: "uuid" },
          childId: { type: "string", format: "uuid" },
          scoreAchieved: { type: "number", description: "Score achieved (0 to maxScore)" },
          recordedBy: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      EventAttendance: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          eventId: { type: "string", format: "uuid" },
          personType: {
            type: "string",
            enum: ["Member", "Child"],
            description: "Type of person attending",
          },
          personId: { type: "string", format: "uuid" },
          status: {
            type: "string",
            enum: ["Present", "Absent", "Excused", "Confirmed"],
            description: "Attendance status",
          },
          recordedBy: { type: "string" },
          confirmedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
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
    "/annual-plans": {
      post: {
        summary: "Create annual plan",
        description:
          "Creates a new annual master plan with goals and activities. Weights are auto-calculated using BR-030 formula: Weight = 1/3 * (Budget% + People% + Time%)",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["academicYear", "title", "createdBy", "goals"],
                properties: {
                  academicYear: { type: "string", example: "2026-2027" },
                  title: { type: "string", example: "Annual Master Plan 2026" },
                  createdBy: { type: "string" },
                  goals: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["goalNumber", "title", "activities"],
                      properties: {
                        goalNumber: { type: "integer" },
                        title: { type: "string" },
                        activities: {
                          type: "array",
                          items: {
                            type: "object",
                            required: [
                              "activityNumber",
                              "mainActivity",
                              "annualTarget",
                              "budget",
                              "humanResource",
                              "plannedTime",
                              "q1Target",
                              "q2Target",
                              "q3Target",
                              "q4Target",
                            ],
                            properties: {
                              activityNumber: { type: "integer" },
                              mainActivity: { type: "string" },
                              expectedResult: { type: "string" },
                              annualTarget: { type: "integer" },
                              budget: { type: "number" },
                              humanResource: { type: "integer" },
                              plannedTime: { type: "number" },
                              q1Target: { type: "integer" },
                              q2Target: { type: "integer" },
                              q3Target: { type: "integer" },
                              q4Target: { type: "integer" },
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
        },
        responses: {
          "201": { description: "Plan created with calculated weights" },
          "400": { description: "Validation error" },
        },
      },
      get: {
        summary: "List annual plans",
        description: "Returns paginated list of annual plans",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Paginated list of plans",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AnnualMasterPlan" },
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
              },
            },
          },
        },
      },
    },
    "/annual-plans/{id}": {
      get: {
        summary: "Get annual plan",
        description: "Returns a single plan with nested goals and activities",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Plan with goals and activities",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      allOf: [
                        { $ref: "#/components/schemas/AnnualMasterPlan" },
                        {
                          type: "object",
                          properties: {
                            goals: {
                              type: "array",
                              items: {
                                allOf: [
                                  { $ref: "#/components/schemas/PlanGoal" },
                                  {
                                    type: "object",
                                    properties: {
                                      activities: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/PlanActivity" },
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          "404": { description: "Plan not found" },
        },
      },
      patch: {
        summary: "Update annual plan",
        description: "Partially update an annual plan (title, status, approval)",
        tags: ["Planning"],
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
                  title: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["Draft", "Distributed", "Active", "Completed", "Archived"],
                  },
                  approvedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Plan updated" },
          "400": { description: "Invalid status transition" },
        },
      },
    },
    "/annual-plans/{id}/distributions": {
      get: {
        summary: "Get distribution status by plan",
        description:
          "Returns all distributions for a plan with activity and sub-department details",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Distribution status list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          distributionId: { type: "string", format: "uuid" },
                          activityMainActivity: { type: "string" },
                          subDepartmentId: { type: "string" },
                          status: {
                            type: "string",
                            enum: ["Assigned", "In_Progress", "Completed"],
                          },
                          assignedAt: { type: "string", format: "date-time" },
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
    },
    "/annual-plans/{id}/progress": {
      get: {
        summary: "Get progress summary by plan",
        description:
          "Returns progress summary per activity with weight-adjusted completion metrics",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Progress summary",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          goalNumber: { type: "integer" },
                          goalTitle: { type: "string" },
                          activityId: { type: "string", format: "uuid" },
                          mainActivity: { type: "string" },
                          weight: { type: "number", description: "Weight percentage (BR-030)" },
                          progressCount: { type: "integer" },
                          totalNumeric: { type: "number" },
                          latestStatus: { type: "string", nullable: true },
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
    },
    "/annual-plans/{activityId}/distribute": {
      post: {
        summary: "Distribute activity to sub-departments",
        description:
          "Distributes a plan activity to one or more sub-departments. Sub-departments cannot create independent plans (BR-031).",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "activityId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
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
                    items: { type: "string" },
                    description:
                      "Array of sub-department IDs (TIMIHRT, MEZMUR, KUTITR, EKD, KINETIBEB)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Distributions created" },
          "400": { description: "Activity not found" },
        },
      },
    },
    "/annual-plans/distributions/{distributionId}/weekly-plans": {
      post: {
        summary: "Create weekly plan",
        description: "Creates a weekly execution item for a distribution",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "distributionId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ethiopianMonth", "weekNumber", "sessionDate", "taskDescription"],
                properties: {
                  ethiopianMonth: { type: "string", example: "Meskerem" },
                  weekNumber: { type: "integer" },
                  sessionDate: { type: "string", format: "date-time" },
                  taskDescription: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Weekly plan created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/annual-plans/weekly-plans/{weeklyPlanId}/progress": {
      post: {
        summary: "Submit progress",
        description: "Records progress for a weekly plan. Status rolls up via BR-032 aggregation.",
        tags: ["Planning"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "weeklyPlanId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status", "submittedBy"],
                properties: {
                  actualResultNumeric: { type: "number" },
                  actualResultText: { type: "string" },
                  status: { type: "string", enum: ["Assigned", "In_Progress", "Completed"] },
                  challenges: { type: "string" },
                  submittedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Progress recorded" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/academic/assessments": {
      post: {
        summary: "Create academic assessment",
        description: "Creates a new academic assessment (quiz, exam, assignment)",
        tags: ["Academic"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "curriculumId",
                  "assessmentType",
                  "subjectTopic",
                  "maxScore",
                  "academicPeriod",
                ],
                properties: {
                  curriculumId: { type: "string", format: "uuid" },
                  assessmentType: {
                    type: "string",
                    enum: ["Mid_Exam", "Final_Exam", "Quiz", "Assignment"],
                  },
                  subjectTopic: { type: "string" },
                  maxScore: { type: "number" },
                  academicPeriod: { type: "string" },
                  examDate: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Assessment created" },
          "400": { description: "Validation error" },
        },
      },
      get: {
        summary: "List academic assessments",
        description: "Returns paginated list of academic assessments with optional filters",
        tags: ["Academic"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
          {
            name: "subjectTopic",
            in: "query",
            schema: { type: "string" },
            description: "Filter by subject topic",
          },
          {
            name: "assessmentType",
            in: "query",
            schema: { type: "string", enum: ["Mid_Exam", "Final_Exam", "Quiz", "Assignment"] },
          },
        ],
        responses: {
          "200": { description: "Assessments listed" },
        },
      },
    },
    "/academic/assessments/{assessmentId}/scores": {
      post: {
        summary: "Record student score",
        description: "Records a score for a student on a specific assessment",
        tags: ["Academic"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "assessmentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["childId", "scoreAchieved", "recordedBy"],
                properties: {
                  childId: { type: "string", format: "uuid" },
                  scoreAchieved: { type: "number", description: "Score (0 to maxScore)" },
                  recordedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Score recorded" },
          "400": { description: "Score outside valid range" },
        },
      },
      get: {
        summary: "List scores by assessment",
        description: "Returns all scores for a specific assessment",
        tags: ["Academic"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "assessmentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Scores listed" },
        },
      },
    },
    "/academic/children/{childId}/scores": {
      get: {
        summary: "List scores by child",
        description: "Returns all academic scores for a specific child",
        tags: ["Academic"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "childId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Scores listed" },
        },
      },
    },
    "/events/{id}/attendance": {
      post: {
        summary: "Record event attendance",
        description: "Records attendance for a member or child at an event",
        tags: ["Events"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Event ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["personType", "personId", "status", "recordedBy"],
                properties: {
                  personType: { type: "string", enum: ["Member", "Child"] },
                  personId: { type: "string", format: "uuid" },
                  status: { type: "string", enum: ["Present", "Absent", "Excused", "Confirmed"] },
                  recordedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Attendance recorded" },
          "400": { description: "Event not found" },
        },
      },
      get: {
        summary: "List event attendance",
        description: "Returns all attendance records for an event",
        tags: ["Events"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Event ID",
          },
        ],
        responses: {
          "200": { description: "Attendance listed" },
        },
      },
    },
    "/events/{id}/attendance/{attendanceId}": {
      put: {
        summary: "Update event attendance",
        description: "Updates attendance status or confirmation for a specific record",
        tags: ["Events"],
        security: [{ sessionAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Event ID",
          },
          {
            name: "attendanceId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Attendance record ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["Present", "Absent", "Excused", "Confirmed"] },
                  confirmedAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Attendance updated" },
          "400": { description: "Attendance not found" },
        },
      },
    },
  },
};

export function swaggerJsonHandler(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");
  res.send(openApiSpec);
}
