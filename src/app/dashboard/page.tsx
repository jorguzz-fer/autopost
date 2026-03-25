"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  type: string;
  category: string;
  status: string;
  title: string | null;
  hook: string | null;
  outputUrl: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Rascunho", color: "bg-gray-500" },
  RENDERING: { label: "Renderizando", color: "bg-yellow-500" },
  RENDERED: { label: "Pronto", color: "bg-green-500" },
  SCHEDULED: { label: "Agendado", color: "bg-blue-500" },
  PUBLISHED: { label: "Publicado", color: "bg-purple-500" },
  FAILED: { label: "Erro", color: "bg-red-500" },
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Meus Posts</h1>
        <Link
          href="/dashboard/novo"
          className="rounded-lg bg-[#4f8a3c] px-6 py-3 font-medium text-white hover:bg-[#5ea048] transition-colors"
        >
          + Criar Novo Post
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4f8a3c] border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#444] bg-[#222] p-16 text-center">
          <p className="mb-4 text-lg text-[#a0a0a0]">
            Nenhum post criado ainda
          </p>
          <Link
            href="/dashboard/novo"
            className="inline-block rounded-lg bg-[#4f8a3c] px-6 py-3 font-medium text-white hover:bg-[#5ea048] transition-colors"
          >
            Criar seu primeiro post
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const statusInfo = STATUS_LABELS[post.status] || STATUS_LABELS.DRAFT;
            return (
              <div
                key={post.id}
                className="rounded-xl border border-[#333] bg-[#222] p-5 transition-colors hover:border-[#4f8a3c]"
              >
                {post.outputUrl && (
                  <div className="mb-3 aspect-[1080/1350] overflow-hidden rounded-lg bg-[#333]">
                    <img
                      src={post.outputUrl}
                      alt={post.title || "Post"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {post.title || post.hook || "Sem título"}
                    </p>
                    <p className="mt-1 text-sm text-[#a0a0a0]">
                      {post.category} &middot; {post.type}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
