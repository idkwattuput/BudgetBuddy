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

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterEach(async () => {
  await prisma.user.deleteMany();
});

describe("User API Test", () => {
  test("Update currency", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const res = await request(app)
      .put("/api/v1/users/currency")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send({
        currency: "$",
      });
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        currency: true,
      },
    });
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(user);
  });

  test("Fail update currency", async () => {
    const accessToken = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    const res = await request(app)
      .put("/api/v1/users/currency")
      .auth(accessToken.body.accessToken, { type: "bearer" })
      .send({
        none: "$",
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All field are required");
  });
});
