import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("Centralized error handling", () => {
  it("should return a structured 500 response", async () => {
    const response = await request(app).get("/__test_error");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Test error");
  });
});