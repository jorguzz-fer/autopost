import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const category = req.nextUrl.searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const post = await prisma.post.create({
      data: {
        type: body.type || "FEED",
        category: body.category,
        title: body.title,
        subtitle: body.subtitle,
        hook: body.hook,
        description: body.description,
        cta: body.cta,
        backgroundUrl: body.backgroundUrl,
        imageUrl: body.imageUrl,
        elements: body.elements || [],
        status: body.scheduledAt ? "SCHEDULED" : "DRAFT",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
