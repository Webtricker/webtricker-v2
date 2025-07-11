import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyAdmin } from '@/utils/validator';
import dbConnect from '@/lib/dbConnect';
import Media from '@/models/Media';
import { IMedia } from '@/models/Media';

// Upload a single file to Cloudinary and return media data
async function uploadFileToCloudinary(file: File): Promise<IMedia> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isSvg = file.type === 'image/svg+xml' || file.name.endsWith('.svg');

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: isSvg ? 'raw' : 'auto',
                format: isSvg ? 'svg' : undefined,
            },
            (error, result) => {
                if (error) {
                    console.error(`Cloudinary upload error for file "${file.name}":`, error);
                    return reject(new Error(`Cloudinary upload failed for ${file.name}`));
                }

                if (!result) {
                    return reject(new Error('Cloudinary upload returned no result.'));
                }

                // Only include required fields based on IMedia
                const media: IMedia = {
                    secure_url: result.secure_url,
                    resource_type: result.resource_type === 'video' ? 'video' : 'image',
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    size: result.bytes,
                    duration: result.duration, // Only present for videos
                };

                resolve(media);
            }
        ).end(buffer);
    });
}

export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
        return NextResponse.json(
            { success: false, message: 'Invalid content type' },
            { status: 415 }
        );
    }

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
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No files provided' },
                { status: 400 }
            );
        }

        if (files.length > 10) {
            return NextResponse.json(
                { success: false, message: 'Too many files. Max 10 allowed.' },
                { status: 413 }
            );
        }

        const allowedTypes = ['image/', 'video/'];

        const invalidFiles = files.filter(
            (file) => !allowedTypes.some((type) => file.type.startsWith(type))
        );

        if (invalidFiles.length > 0) {
            return NextResponse.json(
                { success: false, message: 'Image and Video are allowed' },
                { status: 400 }
            )
        }

        // Upload all files and save to DB
        const uploadedResults = await Promise.all(
            files.map(async (file) => {
                const mediaData = await uploadFileToCloudinary(file);
                const savedMedia = await Media.create(mediaData);
                return savedMedia.toObject();
            })
        );

        return NextResponse.json({
            success: true,
            message: 'Files uploaded and saved successfully!',
            uploadedFiles: uploadedResults,
        });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json(
            { success: false, message: 'Upload failed' },
            { status: 500 }
        );
    }
}
