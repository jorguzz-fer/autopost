"use client";

import { useState } from "react";

interface StepImageProps {
  value: string;
  onChange: (v: string) => void;
  sheetsImages?: string[];
}

export default function StepImage({
  value,
  onChange,
  sheetsImages = [],
}: StepImageProps) {
  const [customUrl, setCustomUrl] = useState("");

  // Remove duplicates
  const uniqueImages = [...new Set(sheetsImages)];

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Imagem de Apoio</h2>
      <p className="mb-4 text-sm text-[#a0a0a0]">
        Selecione uma imagem ou cole uma URL. (Opcional)
      </p>

      {uniqueImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {uniqueImages.map((url, i) => (
            <button
              key={i}
              onClick={() => onChange(url)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                value === url
                  ? "border-[#4f8a3c] ring-2 ring-[#4f8a3c] scale-105"
                  : "border-[#444] hover:border-[#666]"
              }`}
            >
              <img
                src={url}
                alt={`Img ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23333'%3E%3Crect width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' fill='%23666' font-size='12'%3EErro%3C/text%3E%3C/svg%3E";
                }}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#444] bg-[#1a1a1a] p-6 text-center">
          <p className="text-sm text-[#a0a0a0]">
            Nenhuma imagem encontrada na planilha.
          </p>
          <p className="mt-1 text-xs text-[#666]">
            Adicione URLs na coluna &quot;URL IMG&quot; ou cole uma URL abaixo.
          </p>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-sm text-[#a0a0a0]">Ou cole uma URL:</p>
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

      {value && (
        <button
          onClick={() => onChange("")}
          className="mt-3 text-sm text-red-400 hover:text-red-300"
        >
          Remover imagem
        </button>
      )}
    </div>
  );
}
