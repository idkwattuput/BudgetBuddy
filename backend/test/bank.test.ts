import { beforeEach, afterEach, describe, expect, test } from "bun:test";
import request from "supertest";
import { prisma } from "../src/database/db";
import { app } from "../src";

let testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@mail.com",
  password: "123johndoe",
};

let mockBank = { bankName: "Maybank", accountName: "Abdul" };

beforeEach(async () => {
  await prisma.bank.deleteMany();
  await prisma.user.deleteMany();
});

afterEach(async () => {
  await prisma.bank.deleteMany();
  await prisma.user.deleteMany();
});

describe("Bank API Test", () => {
  test("Get empty banks", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const res = await request(app)
      .get("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" });
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
  test("Get banks", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const newBank = await request(app)
      .post("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send(mockBank);
    const res = await request(app)
      .get("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" });
    expect(res.status).toBe(200);
    // Idk how this is work, i guess this is really javascript moment ;)
    expect(res.body.data).toEqual([newBank.body.data]);
  });
  test("Create bank", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const res = await request(app)
      .post("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send(mockBank);
    const bank = await prisma.bank.findUnique({
      where: { id: res.body.data.id },
    });
    bank.created_at = bank?.created_at.toISOString();
    bank.updated_at = bank?.updated_at.toISOString();
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(bank);
  });
  test("Fail create bank", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const res = await request(app)
      .post("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send({ bankAccount: "", accountName: "" });
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual("All fields are required");
  });
  test("Delete bank", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const newBank = await request(app)
      .post("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send(mockBank);
    const res = await request(app)
      .delete(`/api/v1/banks/${newBank.body.data.id}`)
      .auth(accessToken.body.accessToken, { type: "bearer" });
    expect(res.status).toBe(204);
  });
  test("Fail delete bank", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    await request(app)
      .post("/api/v1/banks")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send(mockBank);
    const res = await request(app)
      .delete(`/api/v1/banks/4`)
      .auth(accessToken.body.accessToken, { type: "bearer" });
    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("Bank doesn't exist");
  });
});
