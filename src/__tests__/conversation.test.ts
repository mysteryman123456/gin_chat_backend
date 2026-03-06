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
let secondAuthToken = "";
let secondUserId = "";
export let conversationId = "";

beforeAll(async () => {
  await UserModel.deleteMany({
    email: { $in: [testUser.email, secondTestUser.email] },
  });
  await ConversationModel.deleteMany({});

  await request(app).post("/api/auth/signup").send(testUser);
  await request(app).post("/api/auth/signup").send(secondTestUser);

  const res1 = await request(app)
    .post("/api/auth/login")
    .send({ email: testUser.email, password: testUser.password });
  authToken = res1.body.data.token;

  const res2 = await request(app)
    .post("/api/auth/login")
    .send({ email: secondTestUser.email, password: secondTestUser.password });
  secondAuthToken = res2.body.data.token;
  secondUserId = res2.body.data.user?._id ?? res2.body.data._id;
});

afterAll(async () => {
  await UserModel.deleteMany({
    email: { $in: [testUser.email, secondTestUser.email] },
  });
  await ConversationModel.deleteMany({});
  const mongoose = await import("mongoose");
  await mongoose.default.connection.close();
});

describe("POST /api/conversation", () => {
  test("36. valid data → creates SINGLE conversation successfully", async () => {
    const res = await request(app)
      .post("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ user_id: secondUserId, type: "SINGLE" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Conversation created successfully"
    );
  });

  test("37. duplicate SINGLE conversation → still 201 (idempotent)", async () => {
    const res = await request(app)
      .post("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ user_id: secondUserId, type: "SINGLE" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
  });

  test("38. creates GROUP conversation with group_name", async () => {
    const res = await request(app)
      .post("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ user_id: secondUserId, type: "GROUP", group_name: "Test Group" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Conversation created successfully"
    );
  });

  test("39. missing user_id → 400", async () => {
    const res = await request(app)
      .post("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ type: "SINGLE" });
    expect(res.status).toBe(400);
  });

  test("40. invalid type value → 400", async () => {
    const res = await request(app)
      .post("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ user_id: secondUserId, type: "INVALID_TYPE" });
    expect(res.status).toBe(400);
  });

  test("41. no auth token → 401", async () => {
    const res = await request(app)
      .post("/api/conversation")
      .send({ user_id: secondUserId, type: "SINGLE" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/conversation", () => {
  test("42. authenticated user → returns conversations list", async () => {
    const res = await request(app)
      .get("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      conversationId = res.body.data[0].conversation_id;
    }
  });

  test("43. each conversation has users, type, conversation_id fields", async () => {
    const res = await request(app)
      .get("/api/conversation")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(201);
    if (res.body.data.length > 0) {
      const convo = res.body.data[0];
      expect(convo).toHaveProperty("users");
      expect(convo).toHaveProperty("type");
      expect(convo).toHaveProperty("conversation_id");
      expect(Array.isArray(convo.users)).toBe(true);
    }
  });

  test("44. second user can also see the conversation", async () => {
    const res = await request(app)
      .get("/api/conversation")
      .set("Authorization", `Bearer ${secondAuthToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
  });

  test("45. no auth token → 401", async () => {
    const res = await request(app).get("/api/conversation");
    expect(res.status).toBe(401);
  });
});
