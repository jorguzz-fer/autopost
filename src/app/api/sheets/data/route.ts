import { NextResponse } from "next/server";
import { readPendingRows } from "@/lib/google-sheets";

export async function GET() {
  try {
    const rows = await readPendingRows();
    return NextResponse.json({ rows });
  } catch (error) {
    console.error("Sheets data error:", error);
    return NextResponse.json(
      { error: "Failed to read Google Sheets", rows: [] },
      { status: 500 }
    );
  }
}
