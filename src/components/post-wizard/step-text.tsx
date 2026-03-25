"use client";

import { useState } from "react";
import type { PostText } from "@/types/post";

interface StepTextProps {
  category: string;
  value: PostText;
  onChange: (v: PostText) => void;
}

interface GeneratedOption {
  title: string;
  subtitle: string;
  hook: string;
  description: string;
  cta: string;
}

export default function StepText({ category, value, onChange }: StepTextProps) {
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState<GeneratedOption[]>([]);
  const [topic, setTopic] = useState("");

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

      {/* AI Generation */}
      <div className="mb-6 rounded-xl border border-[#444] bg-[#1a1a1a] p-4">
        <p className="mb-3 text-sm font-medium text-[#a0a0a0]">
          Gerar texto com IA
        </p>
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
            {generating ? "Gerando..." : "Gerar Texto com IA"}
          </button>
        </div>
      </div>

      {/* Generated options */}
      {options.length > 0 && (
        <div className="mb-6 grid gap-3">
          <p className="text-sm font-medium text-[#a0a0a0]">
            Escolha uma opção:
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
          <label className="mb-1 block text-sm text-[#a0a0a0]">Título</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Título principal"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">Subtítulo</label>
          <input
            type="text"
            value={value.subtitle}
            onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
            placeholder="Subtítulo complementar"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#a0a0a0]">Descrição</label>
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
            placeholder="Chamada para ação"
            className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-white placeholder-[#666] focus:border-[#4f8a3c] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
