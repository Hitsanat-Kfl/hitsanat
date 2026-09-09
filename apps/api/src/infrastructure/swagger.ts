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
  },
};

export function swaggerJsonHandler(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");
  res.send(openApiSpec);
}
