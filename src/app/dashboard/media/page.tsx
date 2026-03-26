"use client";

import { useState, useEffect, useRef } from "react";

type MediaType = "backgrounds" | "elements" | "images";

const TABS: { key: MediaType; label: string }[] = [
  { key: "backgrounds", label: "Backgrounds" },
  { key: "elements", label: "Elementos" },
  { key: "images", label: "Imagens de Apoio" },
];

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<MediaType>("backgrounds");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async (type: MediaType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?type=${type}`);
      const data = await res.json();
      setUrls(data.urls || []);
    } catch {
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia(activeTab);
  }, [activeTab]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("type", activeTab);
      Array.from(files).forEach((file) => formData.append("file", file));

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await loadMedia(activeTab);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    setDeleting(url);
    try {
      await fetch(`/api/media?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      });
      setUrls((prev) => prev.filter((u) => u !== url));
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Biblioteca de Imagens</h1>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-[#4f8a3c] px-4 py-2 font-medium text-white hover:bg-[#5ea048] disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[#1a1a1a] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[#4f8a3c] text-white"
                : "text-[#a0a0a0] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4f8a3c] border-t-transparent" />
        </div>
      ) : urls.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#444] bg-[#1a1a1a] p-16 text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-[#a0a0a0]">
            Nenhuma imagem em {TABS.find((t) => t.key === activeTab)?.label}
          </p>
          <p className="mt-2 text-sm text-[#666]">
            Clique em &quot;Upload&quot; para adicionar imagens.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            activeTab === "backgrounds"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
          }`}
        >
          {urls.map((url) => (
            <div key={url} className="group relative">
              <div
                className={`overflow-hidden rounded-xl border border-[#333] bg-[#1a1a1a] ${
                  activeTab === "backgrounds" ? "aspect-[1080/1350]" : "aspect-square"
                }`}
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <button
                onClick={() => handleDelete(url)}
                disabled={deleting === url}
                className="absolute top-2 right-2 rounded-full bg-red-600/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
              >
                {deleting === url ? (
                  <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
