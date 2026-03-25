"use client";

import { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/types/post";
import type { PostText, PostElement, SheetsRow } from "@/types/post";
import { CATEGORY_LAYOUTS } from "@/lib/categories";
import StepType from "@/components/post-wizard/step-type";
import StepCategory from "@/components/post-wizard/step-category";
import StepBackground from "@/components/post-wizard/step-background";
import StepText from "@/components/post-wizard/step-text";
import StepElements from "@/components/post-wizard/step-elements";
import StepImage from "@/components/post-wizard/step-image";
import PostPreview from "@/components/post-wizard/post-preview";

type PostTypeValue = "FEED" | "CAROUSEL";

const STEPS = [
  "Tipo & Categoria",
  "Background",
  "Texto",
  "Elementos",
  "Imagem",
  "Preview & Salvar",
];

export default function NovoPostPage() {
  const [step, setStep] = useState(0);
  const [postType, setPostType] = useState<PostTypeValue>("FEED");
  const [category, setCategory] = useState<string>("");
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [text, setText] = useState<PostText>({
    title: "",
    subtitle: "",
    hook: "",
    description: "",
    cta: "",
  });
  const [elements, setElements] = useState<PostElement[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [sheetsData, setSheetsData] = useState<SheetsRow[]>([]);
  const [sheetsLoading, setSheetsLoading] = useState(true);

  // Load sheets data on mount
  useEffect(() => {
    async function loadSheets() {
      try {
        const res = await fetch("/api/sheets/data");
        const data = await res.json();
        if (data.rows) setSheetsData(data.rows);
      } catch (error) {
        console.error("Error loading sheets:", error);
      } finally {
        setSheetsLoading(false);
      }
    }
    loadSheets();
  }, []);

  const canNext = () => {
    switch (step) {
      case 0:
        return !!category;
      case 1:
        return !!backgroundUrl;
      case 2:
        return !!text.title;
      default:
        return true;
    }
  };

  const handlePreview = async () => {
    const res = await fetch("/api/render?format=base64", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        background: backgroundUrl,
        text,
        elements,
        image: imageUrl
          ? { url: imageUrl, x: 0, y: 700, width: 1080, height: 650 }
          : undefined,
        category,
      }),
    });
    const data = await res.json();
    if (data.image) {
      setPreviewUrl(`data:image/png;base64,${data.image}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          category,
          title: text.title,
          subtitle: text.subtitle,
          hook: text.hook,
          description: text.description,
          cta: text.cta,
          backgroundUrl,
          imageUrl,
          elements,
        }),
      });
      const post = await res.json();

      // Render and save
      await fetch(`/api/render?format=url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          background: backgroundUrl,
          text,
          elements,
          image: imageUrl
            ? { url: imageUrl, x: 0, y: 700, width: 1080, height: 650 }
            : undefined,
          category,
        }),
      });

      setSaved(true);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    if (step === 4) {
      handlePreview();
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,280px]">
      <div>
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                i === step
                  ? "bg-[#4f8a3c] text-white"
                  : i < step
                  ? "bg-[#333] text-white cursor-pointer hover:bg-[#444]"
                  : "bg-[#222] text-[#666]"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-[#333] bg-[#222] p-6">
          {step === 0 && (
            <div className="space-y-6">
              <StepType value={postType} onChange={setPostType} />
              <StepCategory value={category} onChange={setCategory} />
            </div>
          )}
          {step === 1 && (
            <StepBackground
              category={category}
              value={backgroundUrl}
              onChange={setBackgroundUrl}
              sheetsBackgrounds={sheetsData
                .filter((r) => r.urlBg)
                .map((r) => r.urlBg)}
              loading={sheetsLoading}
            />
          )}
          {step === 2 && (
            <StepText
              category={category}
              value={text}
              onChange={setText}
              sheetsRows={sheetsData.filter(
                (r) => r.categoria === category && r.titulo
              )}
            />
          )}
          {step === 3 && (
            <StepElements value={elements} onChange={setElements} />
          )}
          {step === 4 && (
            <StepImage
              value={imageUrl}
              onChange={setImageUrl}
              sheetsImages={sheetsData
                .filter((r) => r.urlImg)
                .map((r) => r.urlImg)}
            />
          )}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Preview & Salvar</h2>
              {previewUrl ? (
                <div className="mx-auto max-w-sm">
                  <div className="overflow-hidden rounded-2xl border-4 border-[#333] shadow-xl">
                    <img
                      src={previewUrl}
                      alt="Preview do post"
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-xl bg-[#1a1a1a] py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4f8a3c] border-t-transparent" />
                </div>
              )}

              {saved ? (
                <div className="rounded-xl bg-green-900/30 border border-green-700 p-4 text-center">
                  <p className="text-lg font-medium text-green-400">
                    Post salvo com sucesso!
                  </p>
                  <a
                    href="/dashboard"
                    className="mt-3 inline-block rounded-lg bg-[#4f8a3c] px-6 py-2 text-white hover:bg-[#5ea048]"
                  >
                    Voltar ao Dashboard
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving || !previewUrl}
                  className="w-full rounded-xl bg-[#4f8a3c] py-4 text-lg font-bold text-white hover:bg-[#5ea048] disabled:opacity-50 transition-colors"
                >
                  {saving ? "Salvando..." : "Salvar Post"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 5 && (
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
              className="rounded-lg border border-[#444] px-6 py-2 text-[#a0a0a0] hover:border-[#666] hover:text-white disabled:opacity-30 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={goNext}
              disabled={!canNext()}
              className="rounded-lg bg-[#4f8a3c] px-8 py-2 font-medium text-white hover:bg-[#5ea048] disabled:opacity-30 transition-colors"
            >
              Próximo
            </button>
          </div>
        )}
      </div>

      {/* Live preview sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-8">
          <p className="mb-3 text-sm font-medium text-[#a0a0a0]">Preview</p>
          <PostPreview
            background={backgroundUrl}
            text={text}
            elements={elements}
            imageUrl={imageUrl}
            category={category}
          />
        </div>
      </div>
    </div>
  );
}
