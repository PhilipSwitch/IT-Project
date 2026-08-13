import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("GET /health", () => {
  it("should return a healthy response", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});