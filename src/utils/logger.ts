import { NextRequest } from "next/server";
import { verifyToken, DecodedToken } from "@/lib/auth";
import ActivityLog from "@/models/ActivityLog";
import connectToDatabase from "@/lib/dbConnect";

export const logActivity = async (
  req: NextRequest,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'OTHER',
  resource: string,
  details: string
) => {
  try {
    await connectToDatabase();

    const token = req.cookies.get('accessToken')?.value;
    let userEmail = 'System';

    if (token) {
      const decoded = verifyToken(token) as DecodedToken | null;
      if (decoded && decoded.email) {
        userEmail = decoded.email;
      }
    }

    await ActivityLog.create({
      userEmail,
      action,
      resource,
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to prevent crashing the main request
  }
};
