"use client";

import { useState } from "react";

interface StepImageProps {
  value: string;
  onChange: (v: string) => void;
}

// Sample images from the user's existing URLs
const SAMPLE_IMAGES = [
  "https://tudomudou.com.br/customers/alchemypet/img/vet/1.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/2.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/3.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/4.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/5.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/6.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/7.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/8.png",
  "https://tudomudou.com.br/customers/alchemypet/img/vet/9.png",
];

export default function StepImage({ value, onChange }: StepImageProps) {
  const [customUrl, setCustomUrl] = useState("");

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Imagem de Apoio</h2>
      <p className="mb-4 text-sm text-[#a0a0a0]">
        Selecione uma imagem ou cole uma URL. (Opcional)
      </p>

      <div className="grid grid-cols-3 gap-3">
        {SAMPLE_IMAGES.map((url, i) => (
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
            />
          </button>
        ))}
      </div>

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
