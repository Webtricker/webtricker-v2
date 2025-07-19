import { NextResponse } from "next/server"

export const GET = async () => {
    return NextResponse.json({
       
        message: "Success",
        timestamp: new Date().toISOString(),
    },{ status: 200})
}