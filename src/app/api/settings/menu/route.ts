import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/Menu';
import { verifyAdmin } from '@/utils/validator';
import { DbMenuLink } from '@/types/menu';

export const GET = async (req: NextRequest) => {
  await dbConnect();

  const menuType = req.nextUrl.searchParams.get('menuType') || 'header';

  const items = await MenuItem.find({ menuType }).lean();
  return NextResponse.json({ success: true, data: items });
};

export const PUT = async (req: NextRequest) => {
  // Authenticate admin user
  try {
    await dbConnect();
    await verifyAdmin(req);
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { menuType, links }: { menuType: 'header' | 'footer'; links: DbMenuLink[] } = body;

    // Validate input
    if (!menuType || !['header', 'footer'].includes(menuType)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing menuType.' }, { status: 400 });
    }

    if (!Array.isArray(links)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing links array.' }, { status: 400 });
    }

    const updatedMenu = await MenuItem.findOneAndUpdate(
      { menuType },
      { links },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, message: 'Update successful', data: updatedMenu });
  } catch (error) {
    console.error('Menu update error:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};
