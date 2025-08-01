import connectToDatabase from "@/lib/dbConnect";
import Service from "@/models/Service";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { data } = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing service data" },
                { status: 400 }
            );
        }

        const service = new Service(data);
        await service.save()

        return NextResponse.json(
            { success: true, message: "Service added" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: true, message: "Service exists in the database" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const GET = async (req:NextRequest) => {
    try {
         const { searchParams } = new URL(req.url);
          const limit = parseInt(searchParams.get("limit") || "99", 10);

        await connectToDatabase();
        const services = await Service.find().sort({createdAt:-1}).limit(limit)
        return NextResponse.json(
            {
                success: true,
                services
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching services from database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};