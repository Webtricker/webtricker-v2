import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyAdmin } from '@/utils/validator';
import dbConnect from '@/lib/dbConnect';
import Media from '@/models/Media';
import { IMedia } from '@/models/Media';

// Upload a single file to Cloudinary and return media data
async function uploadFileToCloudinary(file: File, name?: string): Promise<IMedia> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const isSvg = file.type === 'image/svg+xml' || file.name.endsWith('.svg');

    const baseOpts = {
        resource_type: (isSvg ? 'raw' : 'auto') as 'raw' | 'auto',
        format: isSvg ? 'svg' : undefined,
    };

    const doUpload = (extraOpts: Record<string, unknown> = {}): Promise<IMedia> =>
        new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { ...baseOpts, ...extraOpts },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Cloudinary upload returned no result.'));
                    resolve({
                        secure_url: result.secure_url,
                        resource_type: result.resource_type === 'video' ? 'video' : 'image',
                        asset_id: result.asset_id,
                        public_id: result.public_id,
                        format: result?.format || 'svg',
                        width: result?.width || 100,
                        height: result?.height || 100,
                        size: result.bytes,
                        duration: result.duration,
                    });
                }
            ).end(buffer);
        });

    if (!name) return doUpload();

    try {
        return await doUpload({ public_id: name, overwrite: false });
    } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const isCollision =
            msg.includes('already exists') ||
            err?.http_code === 409 ||
            err?.http_code === 420;
        if (isCollision) {
            // Append a short random suffix and retry without overwrite guard
            const suffix = Math.random().toString(36).slice(2, 6);
            return doUpload({ public_id: `${name}-${suffix}` });
        }
        throw new Error(`Cloudinary upload failed for ${file.name}`);
    }
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
        const names = formData.getAll('names') as string[];

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
            files.map(async (file, i) => {
                const name = names[i]?.trim() || undefined;
                const mediaData = await uploadFileToCloudinary(file, name);
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
