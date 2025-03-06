"use server";
import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("ATBB")?.value;
}

export async function setAccessToken(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("ATBB", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10,
  });
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("RTBB")?.value;
}

export async function isUserAuthenticated() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ATBB")?.value;
  const refreshToken = cookieStore.get("RTBB")?.value;
  if (!accessToken || !refreshToken) {
    return false;
  }
  return true;
}
