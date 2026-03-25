import { NextResponse } from "next/server";
import { readPendingRows } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await readPendingRows();
    return NextResponse.json({ rows });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Sheets data error:", message);
    return NextResponse.json(
      { error: message, rows: [] },
      { status: 500 }
    );
  }
}
