import { NextResponse } from "next/server";
import { readPendingRows } from "@/lib/google-sheets";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const rows = await readPendingRows();

    const results = [];
    for (const row of rows) {
      if (!row.categoria) continue;

      const post = await prisma.post.upsert({
        where: { sheetsRowId: String(row.rowIndex) },
        create: {
          sheetsRowId: String(row.rowIndex),
          category: row.categoria,
          title: row.titulo,
          subtitle: row.subtitulo,
          hook: row.hook,
          description: row.descricao,
          cta: row.cta,
          imageUrl: row.urlImg,
          backgroundUrl: row.urlBg,
          status: row.status === "Publicado" ? "PUBLISHED" : "DRAFT",
          mode: row.modo,
          scheduledAt: row.dia ? new Date(row.dia) : null,
        },
        update: {
          category: row.categoria,
          title: row.titulo,
          subtitle: row.subtitulo,
          hook: row.hook,
          description: row.descricao,
          cta: row.cta,
          imageUrl: row.urlImg,
          backgroundUrl: row.urlBg,
          mode: row.modo,
        },
      });
      results.push(post);
    }

    return NextResponse.json({ synced: results.length, posts: results });
  } catch (error) {
    console.error("Sheets sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync from Google Sheets" },
      { status: 500 }
    );
  }
}
