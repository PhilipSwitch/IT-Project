import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("Authentication", () => {
  it("should reject registration when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
      });

    expect(response.status).toBe(400);
  });

  it("should reject login when credentials are missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should reject invalid login credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "doesnotexist@example.com",
        password: "WrongPassword123!",
      });

    expect(response.status).toBe(401);
  });
});