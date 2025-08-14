import connectToDatabase from "@/lib/dbConnect";
import Portfolio from "@/models/Portfolio";
import { verifyAdmin } from "@/utils/validator";

import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
    try {
        await connectToDatabase();
        await verifyAdmin(req);

        const { data } = await req.json() || {};
        if (!data) {
            return NextResponse.json(
                { success: false, error: true, message: "Missing portfolio data" },
                { status: 400 }
            );
        }

        const newPortfolio = new Portfolio(data);
        await newPortfolio.save()

        return NextResponse.json(
            { success: true, message: "success" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error adding portfolio to database. ', error);
        return NextResponse.json(
            { success: false, error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};



export const GET = async (req: NextRequest) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        const query: any = {};

        const [portfolios, total] = await Promise.all([
            Portfolio.find(query).sort({createdAt:-1}).skip(skip).limit(limit),
            Portfolio.countDocuments(query)
        ]);

        return NextResponse.json(
            {
                success: true,
                portfolios,
                pagination: {
                    total,
                    page,
                    limit
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching portfolios from database.', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};