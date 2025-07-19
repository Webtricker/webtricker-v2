
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Posts";

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const authorization = req.headers.get('authorization');
    const asyncParams = await params;
    const id = asyncParams.id;

    // --- API Key Validation (Crucial!) ---
    const API_KEY = process.env.WORDPRESS_API_KEY;
    if (!API_KEY || authorization !== `Bearer ${API_KEY}`) {
        console.error('Unauthorized attempt for delete:', authorization);
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();

        await Post.findOneAndDelete({ wordpress_post_id: id });
        return NextResponse.json(
            { success: true, error: false, message: `Post with ID ${id} deleted successfully.` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during post deletion:', error);
        return NextResponse.json(
            { success: false, error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const asyncParams = await params;
    const slug = asyncParams.slug;
    // --- API Key Validation (Crucial!) ---
    try {
        await connectToDatabase();

        const res = await Post.findOne({ slug });
        return NextResponse.json(
            { success: true, post:res },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during post deletion:', error);
        return NextResponse.json(
            { error: true, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};



// export const PUT = async (
//     req: NextRequest,
//     { params }: { poarams: { id: string } }
// ) => {
//     let requestBody: any;
//     try {
//         requestBody = await req.json();
//     } catch (jsonError: any) {
//         console.error('JSON parsing error in PUT request:', jsonError);
//         return NextResponse.json(
//             { success: false, error: true, message: 'Invalid JSON in request body' },
//             { status: 400 }
//         );
//     }

//     const authorization = req.headers.get('authorization');
//     const API_KEY = process.env.WORDPRESS_API_KEY;

//     if (!API_KEY || authorization !== `Bearer ${API_KEY}`) {
//         console.error('Unauthorized attempt for PUT to /api/blogs/[id]:', authorization);
//         return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }
//     const asyncParams = await params;
//     const id = asyncParams.id;
//     const wordpress_post_id_from_url = parseInt(id, 10);

//     if (isNaN(wordpress_post_id_from_url)) {
//         return NextResponse.json(
//             { success: false, error: true, message: 'Invalid Post ID in URL' },
//             { status: 400 }
//         );
//     }

//     console.log(`PUT request for ID: ${wordpress_post_id_from_url}. Received body:`, requestBody);

//     if (!requestBody || Object.keys(requestBody).length === 0) {
//         return NextResponse.json(
//             { success: false, error: true, message: "Request body cannot be empty for PUT (missing update fields)" },
//             { status: 400 }
//         );
//     }


//     try {
//         await connectToDatabase();

//         await Post.findOneAndDelete({ wordpress_post_id: wordpress_post_id_from_url });

//         const newPost = new Post(requestBody);
//         await newPost.save()
//         return NextResponse.json(
//             { success: true, error: false, message: `Post with ID ${wordpress_post_id_from_url} updated successfully.` },
//             { status: 200 }
//         );
//     } catch (error: any) {
//         console.error('Error during post update:', error);
//         return NextResponse.json(
//             { success: false, error: true, message: 'Internal Server Error', details: error.message },
//             { status: 500 }
//         );
//     }
// };