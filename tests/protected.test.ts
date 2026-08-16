import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("Protected routes", () => {
  it("should reject requests without authentication", async () => {
    const response = await request(app).get("/api/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });

  it("should reject access to a role-protected route without authentication", async () => {
    const response = await request(app).get("/api/protected/client");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });
});