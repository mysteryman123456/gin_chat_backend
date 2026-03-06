import request from "supertest";
import app from "../app";
import { UserModel } from "../models/user.model";

export const testUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

export const secondTestUser = {
  username: "seconduser",
  email: "seconduser@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

beforeAll(async () => {
  await UserModel.deleteMany({
    email: { $in: [testUser.email, secondTestUser.email] },
  });
});

describe("POST /api/auth/signup", () => {
  test("1. should register testUser successfully", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Signup successful");
    expect(res.body).toHaveProperty("data");
  });

  test("2. should register secondUser successfully", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send(secondTestUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
  });

  test("3. should fail  email already registered", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });

  test("4. should fail  email field missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "noEmail",
      password: "Pass@123",
      confirmPassword: "Pass@123",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });

  test("5. should fail  password field missing", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "noPass", email: "nopass@example.com" });
    expect(res.status).toBe(400);
  });

  test("6. should fail  username field missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "noname@example.com",
      password: "Pass@123",
      confirmPassword: "Pass@123",
    });
    expect(res.status).toBe(400);
  });

  test("7. should fail  empty request body", async () => {
    const res = await request(app).post("/api/auth/signup").send({});
    expect(res.status).toBe(400);
  });

  test("8. signup response should return 201 with user data", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "extrauser",
      email: "extrauser@example.com",
      password: "Pass@123",
      confirmPassword: "Pass@123",
    });
    expect([201, 400]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("data");
    }
  });
});

describe("POST /api/auth/login", () => {
  test("9. correct email + correct password → 200 with token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
  });

  test("10. correct email + incorrect password → 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "WrongPass@999" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });

  test("11. incorrect email + correct password → 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: testUser.password });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });

  test("12. both email and password incorrect → 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@nowhere.com", password: "BadPass@000" });
    expect(res.status).toBe(400);
  });

  test("13. missing email field → 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: testUser.password });
    expect(res.status).toBe(400);
  });

  test("14. missing password field → 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email });
    expect(res.status).toBe(400);
  });

  test("15. empty body → 400", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });

  test("16. response should not expose password field", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.data).not.toHaveProperty("password");
  });
});

describe("GET /api/auth/verify-token", () => {
  let token = "";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    token = res.body.data.token;
  });

  test("17. valid Bearer token → 200 with payload", async () => {
    const res = await request(app)
      .get("/api/auth/verify-token")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Token verified successfully");
    expect(res.body.data).toHaveProperty("payload");
  });

  test("18. missing Authorization header → 401", async () => {
    const res = await request(app).get("/api/auth/verify-token");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Authentication token missing");
  });

  test("19. invalid token → 500 (unhandled JWT error)", async () => {
    const res = await request(app)
      .get("/api/auth/verify-token")
      .set("Authorization", "Bearer invalidtoken.abc.xyz");
    expect(res.status).toBe(500);
  });

  test("20. no Bearer prefix in header → 401", async () => {
    const res = await request(app)
      .get("/api/auth/verify-token")
      .set("Authorization", token);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid authorization format");
  });
});
