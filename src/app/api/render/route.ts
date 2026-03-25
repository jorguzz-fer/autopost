import { NextRequest, NextResponse } from "next/server";
import { renderPost } from "@/lib/render-engine";
import { prisma } from "@/lib/db";
import type { RenderInput } from "@/types/post";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const format = req.nextUrl.searchParams.get("format") || "binary";

    const input: RenderInput = {
      background: body.background || "",
      text: {
        title: body.text?.title || "",
        subtitle: body.text?.subtitle || "",
        hook: body.text?.hook || "",
        description: body.text?.description || "",
        cta: body.text?.cta || "",
      },
      elements: body.elements || [],
      image: body.image || undefined,
      category: body.category || "Autoridade",
    };

    const pngBuffer = await renderPost(input);

    // Save to database if postId provided
    if (body.postId) {
      const outputPath = `/renders/${body.postId}.png`;
      const fs = await import("fs/promises");
      await fs.mkdir(`${process.cwd()}/public/renders`, { recursive: true });
      await fs.writeFile(`${process.cwd()}/public${outputPath}`, pngBuffer);

      await prisma.post.update({
        where: { id: body.postId },
        data: { outputUrl: outputPath, status: "RENDERED" },
      });
    }

    if (format === "url" && body.postId) {
      return NextResponse.json({
        postId: body.postId,
        url: `/renders/${body.postId}.png`,
      });
    }

    if (format === "base64") {
      return NextResponse.json({
        image: pngBuffer.toString("base64"),
        contentType: "image/png",
      });
    }

    // Default: return binary PNG
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="post.png"',
      },
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: "Failed to render post" },
      { status: 500 }
    );
  }
}
