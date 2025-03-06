import { prisma } from "../database/db";

async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

async function findByRefreshToken(refreshToken: string) {
  return await prisma.user.findUnique({
    where: { refresh_token: refreshToken },
  });
}

async function save(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  return prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    },
  });
}

async function updateRefreshToken(id: string, refreshToken: string | null) {
  return prisma.user.update({
    where: { id: id },
    data: {
      refresh_token: refreshToken,
    },
  });
}

async function updateCurrency(id: string, currency: string) {
  return prisma.user.update({
    where: { id: id },
    data: {
      currency: currency,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      currency: true,
    },
  });
}

export default {
  findByEmail,
  findByRefreshToken,
  save,
  updateRefreshToken,
  updateCurrency,
};
