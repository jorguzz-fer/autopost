import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, listFromR2, deleteFromR2, type MediaType } from "@/lib/r2";

const VALID_TYPES: MediaType[] = ["backgrounds", "elements", "images"];

/**
 * GET /api/media?type=backgrounds
 * List all media of a given type
 */
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") as MediaType;

  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Use: backgrounds, elements, images" },
      { status: 400 }
    );
  }

  try {
    const urls = await listFromR2(type);
    return NextResponse.json({ urls });
  } catch (error) {
    console.error("R2 list error:", error);
    return NextResponse.json(
      { error: "Failed to list media" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 * Upload media file(s). Send as FormData with:
 * - file: the file(s)
 * - type: backgrounds | elements | images
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as MediaType;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Use: backgrounds, elements, images" },
        { status: 400 }
      );
    }

    const files = formData.getAll("file") as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploaded: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Generate unique filename: timestamp-originalname
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${timestamp}-${safeName}`;

      const url = await uploadToR2(buffer, filename, type, file.type);
      uploaded.push(url);
    }

    return NextResponse.json({ urls: uploaded });
  } catch (error) {
    console.error("R2 upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media?url=https://...
 * Delete a specific media file
 */
export async function DELETE(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter required" },
      { status: 400 }
    );
  }

  try {
    await deleteFromR2(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("R2 delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
