"use client";

import { useState } from "react";

interface StepBackgroundProps {
  category: string;
  value: string;
  onChange: (v: string) => void;
}

// Placeholder backgrounds - replace with real URLs from your assets
const SAMPLE_BACKGROUNDS: Record<string, string[]> = {
  Autoridade: [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&h=1350&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&h=1350&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&h=1350&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&h=1350&fit=crop",
  ],
  Educativo: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1080&h=1350&fit=crop",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1080&h=1350&fit=crop",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1080&h=1350&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1080&h=1350&fit=crop",
  ],
};

export default function StepBackground({
  category,
  value,
  onChange,
}: StepBackgroundProps) {
  const [customUrl, setCustomUrl] = useState("");
  const backgrounds = SAMPLE_BACKGROUNDS[category] || SAMPLE_BACKGROUNDS["Autoridade"] || [];

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Background</h2>

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
            />
          </button>
        ))}
      </div>

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
