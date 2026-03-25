import { NextRequest, NextResponse } from "next/server";
import { updateRowStatus } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
    const { rowIndex, status, outputUrl } = await req.json();

    if (!rowIndex || !status) {
      return NextResponse.json(
        { error: "rowIndex and status are required" },
        { status: 400 }
      );
    }

    await updateRowStatus(rowIndex, status, outputUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sheets update error:", error);
    return NextResponse.json(
      { error: "Failed to update sheet status" },
      { status: 500 }
    );
  }
}
