"use client";

import { useState, useEffect } from "react";

interface StepBackgroundProps {
  category: string;
  value: string;
  onChange: (v: string) => void;
}

export default function StepBackground({
  category,
  value,
  onChange,
}: StepBackgroundProps) {
  const [customUrl, setCustomUrl] = useState("");
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBackgrounds() {
      try {
        const res = await fetch("/api/media?type=backgrounds");
        const data = await res.json();
        setBackgrounds(data.urls || []);
      } catch (error) {
        console.error("Error loading backgrounds:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBackgrounds();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Background</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4f8a3c] border-t-transparent" />
          <span className="ml-3 text-sm text-[#a0a0a0]">
            Carregando backgrounds...
          </span>
        </div>
      ) : backgrounds.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {backgrounds.map((url, i) => (
            <button
              key={i}
              onClick={() => onChange(url)}
              className={`aspect-[1080/1350] overflow-hidden rounded-xl border-2 transition-all ${
                value === url
                  ? "border-[#4f8a3c] ring-2 ring-[#4f8a3c] scale-105"
                  : "border-[#444] hover:border-[#666]"
              }`}
            >
              <img
                src={url}
                alt={`BG ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='125' fill='%23333'%3E%3Crect width='100' height='125'/%3E%3Ctext x='50' y='62' text-anchor='middle' fill='%23666' font-size='12'%3EErro%3C/text%3E%3C/svg%3E";
                }}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#444] bg-[#1a1a1a] p-6 text-center">
          <p className="text-sm text-[#a0a0a0]">
            Nenhum background encontrado.
          </p>
          <p className="mt-1 text-xs text-[#666]">
            Acesse a <a href="/dashboard/media" className="text-[#4f8a3c] underline">Biblioteca de Imagens</a> para fazer upload.
          </p>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-sm text-[#a0a0a0]">Ou cole uma URL de imagem:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
          <button
            onClick={() => {
              if (customUrl) onChange(customUrl);
            }}
            className="rounded-lg bg-[#4f8a3c] px-4 py-2 text-white hover:bg-[#5ea048]"
          >
            Usar
          </button>
        </div>
      </div>
    </div>
  );
}
