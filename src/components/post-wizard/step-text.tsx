"use client";

import { useState } from "react";
import type { PostText, SheetsRow } from "@/types/post";

interface StepTextProps {
  category: string;
  value: PostText;
  onChange: (v: PostText) => void;
  sheetsRows?: SheetsRow[];
}

interface GeneratedOption {
  title: string;
  subtitle: string;
  hook: string;
  description: string;
  cta: string;
}

export default function StepText({
  category,
  value,
  onChange,
  sheetsRows = [],
}: StepTextProps) {
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState<GeneratedOption[]>([]);
  const [topic, setTopic] = useState("");
  const [showAI, setShowAI] = useState(false);

  const handleSelectFromSheet = (row: SheetsRow) => {
    onChange({
      title: row.titulo,
      subtitle: row.subtitulo,
      hook: row.hook,
      description: row.descricao,
      cta: row.cta,
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic: topic || undefined, count: 3 }),
      });
      const data = await res.json();
      if (data.options) {
        setOptions(data.options);
      }
    } catch (error) {
      console.error("Generate error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const selectOption = (opt: GeneratedOption) => {
    onChange({
      title: opt.title,
      subtitle: opt.subtitle,
      hook: opt.hook,
      description: opt.description,
      cta: opt.cta,
    });
    setOptions([]);
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Texto do Post</h2>

      {/* Sheets data - show first */}
      {sheetsRows.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-[#a0a0a0]">
            Textos da planilha ({sheetsRows.length}):
          </p>
          <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1">
            {sheetsRows.map((row, i) => (
              <button
                key={i}
                onClick={() => handleSelectFromSheet(row)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  value.title === row.titulo
                    ? "border-[#4f8a3c] bg-[#4f8a3c]/10"
                    : "border-[#444] bg-[#1a1a1a] hover:border-[#4f8a3c]"
                }`}
              >
                {row.hook && (
                  <p className="text-xs text-[#a0a0a0]">{row.hook}</p>
                )}
                <p className="mt-1 font-bold text-white">{row.titulo}</p>
                {row.subtitulo && (
                  <p className="mt-1 text-sm text-[#ccc]">{row.subtitulo}</p>
                )}
                {row.descricao && (
                  <p className="mt-2 text-xs text-[#888] line-clamp-2">
                    {row.descricao}
                  </p>
                )}
                {row.cta && (
                  <p className="mt-2 text-xs font-medium text-[#4f8a3c]">
                    {row.cta}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Generation - toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowAI(!showAI)}
          className="flex items-center gap-2 text-sm font-medium text-[#4f8a3c] hover:text-[#5ea048] transition-colors"
        >
          <span>{showAI ? "v" : ">"}</span>
          Gerar texto com IA
        </button>

        {showAI && (
          <div className="mt-3 rounded-xl border border-[#444] bg-[#1a1a1a] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Tema (opcional)"
                className="flex-1 rounded-lg border border-[#444] bg-[#222] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
              />
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-lg bg-[#4f8a3c] px-6 py-2 font-medium text-white hover:bg-[#5ea048] disabled:opacity-50"
              >
                {generating ? "Gerando..." : "Gerar"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generated options */}
      {options.length > 0 && (
        <div className="mb-6 grid gap-3">
          <p className="text-sm font-medium text-[#a0a0a0]">
            Escolha uma opcao:
          </p>
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectOption(opt)}
              className="rounded-xl border border-[#444] bg-[#1a1a1a] p-4 text-left transition-colors hover:border-[#4f8a3c]"
            >
              <p className="text-xs text-[#a0a0a0]">{opt.hook}</p>
              <p className="mt-1 font-bold text-white">{opt.title}</p>
              <p className="mt-1 text-sm text-[#ccc]">{opt.subtitle}</p>
              <p className="mt-2 text-xs text-[#888]">{opt.description}</p>
              <p className="mt-2 text-xs font-medium text-[#4f8a3c]">
                {opt.cta}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Manual editing */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-[#a0a0a0]">Editar manualmente:</p>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">Hook</label>
          <input
            type="text"
            value={value.hook}
            onChange={(e) => onChange({ ...value, hook: e.target.value })}
            placeholder="Frase de abertura impactante"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">Titulo</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Titulo principal"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">Subtitulo</label>
          <input
            type="text"
            value={value.subtitle}
            onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
            placeholder="Subtitulo complementar"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">Descricao</label>
          <textarea
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Texto descritivo"
            rows={3}
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none resize-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">CTA</label>
          <input
            type="text"
            value={value.cta}
            onChange={(e) => onChange({ ...value, cta: e.target.value })}
            placeholder="Chamada para acao"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
