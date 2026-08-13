import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("Bookings", () => {
  it("should reject creating a booking without authentication", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({
        serviceId: 1,
        bookingDate: "2026-08-20",
        scheduledTime: "2026-08-20T14:00:00.000Z",
      });

    expect(response.status).toBe(401);
  });

  it("should reject provider bookings without authentication", async () => {
    const response = await request(app).get("/api/bookings/provider");

    expect(response.status).toBe(401);
  });

  it("should reject client bookings without authentication", async () => {
    const response = await request(app).get("/api/bookings/client");

    expect(response.status).toBe(401);
  });
});