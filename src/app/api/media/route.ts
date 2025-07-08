import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/utils/validator';
import dbConnect from '@/lib/dbConnect';
import Media from '@/models/Media';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    await verifyAdmin(req);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 401 }
    );
  }

  try {
    const media = await Media.find({}).lean();
    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error('Media query failed:', error);
    return NextResponse.json(
      { success: false, message: `Media query failed: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
