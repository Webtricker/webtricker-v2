import connectToDatabase from "@/lib/dbConnect";
import ActivityLog from "@/models/ActivityLog";
import { verifyAdmin } from "@/utils/validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json(
            { success: true, logs },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
