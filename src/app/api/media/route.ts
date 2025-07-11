import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/utils/validator';
import dbConnect from '@/lib/dbConnect';
import cloudinary from '@/lib/cloudinary';
import Media from '@/models/Media';

export async function DELETE(req: NextRequest) {
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
    const { public_id, resource_type } = await req.json();

    if (!public_id || !['image', 'video'].includes(resource_type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid public_id or resource_type' },
        { status: 400 }
      );
    }

    // 1. Delete from Cloudinary
    const cloudResult = await cloudinary.uploader.destroy(public_id, {
      resource_type,
      invalidate: true,
    });

    if (cloudResult.result !== 'ok' && cloudResult.result !== 'not found') {
      return NextResponse.json(
        { success: false, message: 'Failed to delete file from Cloudinary' },
        { status: 500 }
      );
    }

    // 2. Delete from MongoDB
    const dbResult = await Media.deleteOne({ public_id, resource_type });

    if (dbResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'File not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json(
      { success: false, message: `Delete failed: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}


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

  // Extract query param
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // 'image' or 'video'

  if (!type || !['image', 'video'].includes(type)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing 'type' query parameter" },
      { status: 400 }
    );
  }

  try {
    const media = await Media.find({ resource_type: type }).lean();
    return NextResponse.json({
      success: true,
      media
    });
  } catch (error) {
    console.error('Media query failed:', error);
    return NextResponse.json(
      { success: false, message: `Media query failed: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}