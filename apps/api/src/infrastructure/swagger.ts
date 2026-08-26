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
  },
};

export function swaggerJsonHandler(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");
  res.send(openApiSpec);
}
