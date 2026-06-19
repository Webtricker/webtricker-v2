import connectToDatabase from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDatabase();

    const data = await mongoose.connection
      .collection("siteconfigs")
      .findOne({});

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching site config.", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
