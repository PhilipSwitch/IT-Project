import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("Services", () => {
  it("should return the list of services", async () => {
    const response = await request(app).get("/api/services");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("services");
    expect(response.body).toHaveProperty("count");
  });

  it("should reject creating a service without authentication", async () => {
    const response = await request(app)
      .post("/api/services")
      .send({
        title: "Test Service",
        description: "Test description",
        price: 50000,
        pricingType: "FIXED",
      });

    expect(response.status).toBe(401);
  });

  it("should return 404 for a service that does not exist", async () => {
    const response = await request(app).get("/api/services/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Service not found");
  });
});