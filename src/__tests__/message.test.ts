import request from "supertest";
import app from "../app";
import { UserModel } from "../models/user.model";
import { ConversationModel } from "../models/conversation";

const testUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

const secondTestUser = {
  username: "seconduser",
  email: "seconduser@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

let authToken = "";
let conversationId = "";

beforeAll(async () => {
  await UserModel.deleteMany({
    email: { $in: [testUser.email, secondTestUser.email] },
  });
  await ConversationModel.deleteMany({});

  await request(app).post("/api/auth/signup").send(testUser);
  await request(app).post("/api/auth/signup").send(secondTestUser);

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: testUser.email, password: testUser.password });
  authToken = loginRes.body.data.token;

  const login2Res = await request(app)
    .post("/api/auth/login")
    .send({ email: secondTestUser.email, password: secondTestUser.password });
  const secondUserId = login2Res.body.data.user?._id ?? login2Res.body.data._id;

  await request(app)
    .post("/api/conversation")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ user_id: secondUserId, type: "SINGLE" });

  const convRes = await request(app)
    .get("/api/conversation")
    .set("Authorization", `Bearer ${authToken}`);
  if (convRes.body.data?.length > 0) {
    conversationId = convRes.body.data[0].conversation_id;
  }
});

afterAll(async () => {
  await UserModel.deleteMany({
    email: { $in: [testUser.email, secondTestUser.email] },
  });
  await ConversationModel.deleteMany({});
  const mongoose = await import("mongoose");
  await mongoose.default.connection.close();
});

describe("GET /api/message/:conversation_id", () => {
  test("46. valid conversation_id → returns messages array", async () => {
    const res = await request(app)
      .get(`/api/message/${conversationId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("47. messages have content, sender_id, type, createdAt fields", async () => {
    const res = await request(app)
      .get(`/api/message/${conversationId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    if (res.body.data.length > 0) {
      const msg = res.body.data[0];
      expect(msg).toHaveProperty("content");
      expect(msg).toHaveProperty("sender_id");
      expect(msg).toHaveProperty("type");
      expect(msg).toHaveProperty("createdAt");
    }
  });

  test("48. non-existent conversation_id → returns empty array", async () => {
    const res = await request(app)
      .get("/api/message/000000000000000000000000")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test("49. no auth token → still returns 200 (route is public)", async () => {
    const res = await request(app).get(`/api/message/${conversationId}`);
    expect(res.status).toBe(200);
  });

  test("50. invalid conversation_id format → 500", async () => {
    const res = await request(app)
      .get("/api/message/notavalidid")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(500);
  });
});
