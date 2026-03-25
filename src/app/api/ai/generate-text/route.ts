import { NextRequest, NextResponse } from "next/server";
import { generatePostText } from "@/lib/ai-text";

export async function POST(req: NextRequest) {
  try {
    const { category, topic, count } = await req.json();

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const options = await generatePostText(category, topic, count || 3);

    return NextResponse.json({ options });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 }
    );
  }
}
