import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("API Health Endpoint", () => {
  it("GET /health should return 200 and healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("service", "hitsanat-api");
    expect(response.body).toHaveProperty("version", "1.0.0");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("environment");
  });

  it("GET /api/v1/health should also return 200 OK", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("GET /docs.json should return valid OpenAPI specification", async () => {
    const response = await request(app).get("/docs.json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("openapi", "3.0.0");
    expect(response.body.info.title).toBe("Hitsanat Kifl API");
    expect(response.body.paths).toHaveProperty("/health");
  });
});
