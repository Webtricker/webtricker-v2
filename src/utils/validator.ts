
import { DecodedToken, verifyToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (!decoded.exp) return true;
    return decoded?.exp < currentTime;
  } catch (error) {
    console.error('Invalid token', error);
    return true; // Treat invalid tokens as expired
  }
}

export const getJwtExpiration = (token: string): number => {
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : 0;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return 0;
  }
};


export const verifyAdmin = async (req: NextRequest): Promise<true> => {
  const token = req.cookies.get('accessToken')?.value;
  
  if (!token) {
    throw new Error('Access token missing');
  }

  const decoded = verifyToken(token) as DecodedToken | null;

  if (!decoded) {
    throw new Error('Invalid or expired token');
  }

  if (!["admin", "superAdmin", "editor"].includes(decoded.role || "")) {
    throw new Error('Forbidden: Admins only');
  }

  return true;
};


