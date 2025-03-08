"use server";
import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserJWT extends JwtPayload {
  id: string;
  first_name: string;
  last_name: string;
  currency: string;
}

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

export async function getUserJWT(): Promise<UserJWT> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error("Something happen with refresh token");
  }
  return jwtDecode(refreshToken);
}
