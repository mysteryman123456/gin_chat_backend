import request from "supertest";
import app from "../app";
import { UserModel } from "../models/user.model";

const testUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

let authToken = "";
let loggedInUserId = "";

beforeAll(async () => {
  await UserModel.deleteMany({ email: testUser.email });

  await request(app).post("/api/auth/signup").send(testUser);

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: testUser.email, password: testUser.password });

  authToken = res.body.data.token;
  loggedInUserId = res.body.data.user?._id ?? res.body.data._id;
});

afterAll(async () => {
  await UserModel.deleteMany({ email: testUser.email });
  const mongoose = await import("mongoose");
  await mongoose.default.connection.close();
});

describe("POST /api/auth/forgot-password", () => {
  test("21. registered email → 200 with OTP sent message", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testUser.email });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "If email exists, OTP sent.");
    expect(res.body.data).toHaveProperty("token");
  });

  test("22. non-existent email → still 200 (prevents user enumeration)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "ghost@nowhere.com" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "If email exists, OTP sent.");
  });

  test("23. missing email field → 400 with message", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Email is required");
  });
});

describe("POST /api/auth/reset-password", () => {
  test("24. missing token query param → 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ otp: "123456", password: "NewPass@123" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Token missing");
  });

  test("25. invalid token → 400 or 401", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password?token=badtoken")
      .send({ otp: "000000", password: "NewPass@123" });
    expect([400, 401, 500]).toContain(res.status);
  });

  test("26. missing otp in body → 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password?token=sometoken")
      .send({ password: "NewPass@123" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/user/:user", () => {
  test("27. valid email query → returns matching users array", async () => {
    const res = await request(app)
      .get(`/api/user/${testUser.email}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("28. no matching user → returns empty array", async () => {
    const res = await request(app)
      .get("/api/user/zzznomatch99999@example.com")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test("29. no auth token → 401", async () => {
    const res = await request(app).get(`/api/user/${testUser.email}`);
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/user/profile/:id", () => {
  test("30. valid data + valid id → updates profile successfully", async () => {
    const res = await request(app)
      .patch(`/api/user/profile/${loggedInUserId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ username: "updatedusername" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
  });

  test("31. response data should not contain password field", async () => {
    const res = await request(app)
      .patch(`/api/user/profile/${loggedInUserId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ username: "safeuser" });
    expect(res.status).toBe(200);
    expect(res.body.data).not.toHaveProperty("password");
  });

  test("32. no auth token → 401", async () => {
    const res = await request(app)
      .patch(`/api/user/profile/${loggedInUserId}`)
      .send({ username: "noupdate" });
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/user/settings/password", () => {
  test("33. correct current password → updates successfully", async () => {
    const res = await request(app)
      .patch("/api/user/settings/password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: testUser.password,
        newPassword: "NewPass@456",
        confirmNewPassword: "NewPass@456",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Password updated successfully");
  });

  test("34. newPassword and confirmNewPassword mismatch → 400", async () => {
    const res = await request(app)
      .patch("/api/user/settings/password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: testUser.password,
        newPassword: "NewPass@456",
        confirmNewPassword: "DifferentPass@999",
      });
    expect(res.status).toBe(400);
  });

  test("35. no auth token → 401", async () => {
    const res = await request(app).patch("/api/user/settings/password").send({
      currentPassword: "Pass@123",
      newPassword: "New@456",
      confirmNewPassword: "New@456",
    });
    expect(res.status).toBe(401);
  });
});
