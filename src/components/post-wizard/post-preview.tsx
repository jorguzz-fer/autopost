"use client";

import type { PostText, PostElement } from "@/types/post";
import { CATEGORY_LAYOUTS } from "@/lib/categories";

interface PostPreviewProps {
  background: string;
  text: PostText;
  elements: PostElement[];
  imageUrl: string;
  category: string;
}

export default function PostPreview({
  background,
  text,
  elements,
  imageUrl,
  category,
}: PostPreviewProps) {
  const layout = CATEGORY_LAYOUTS[category];
  const colors = layout?.colors || {
    primary: "#1a1a1a",
    accent: "#4f8a3c",
    overlay: "rgba(0,0,0,0.5)",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#333] shadow-xl">
      <div
        className="relative w-full"
        style={{
          aspectRatio: "1080/1350",
          backgroundColor: colors.primary,
          maxHeight: "420px",
        }}
      >
        {/* Layer 1: Background */}
        {background && (
          <img
            src={background}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Layer 2: Support image - bottom portion, contained */}
        {imageUrl && (
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center"
            style={{ height: "45%" }}
          >
            <img
              src={imageUrl}
              alt="Support"
              className="max-h-full max-w-[80%] object-contain drop-shadow-lg"
            />
          </div>
        )}

        {/* Layer 3: Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: colors.overlay }}
        />

        {/* Layer 4: Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-[8%] text-center">
          {text.hook && (
            <p
              className="mb-1 text-[7px] font-semibold leading-tight"
              style={{ color: layout?.text.hook.color || "#FFD700" }}
            >
              {text.hook}
            </p>
          )}
          {text.title && (
            <h2
              className="mb-1 text-[11px] font-extrabold leading-tight"
              style={{ color: "#FFFFFF" }}
            >
              {text.title}
            </h2>
          )}
          {text.subtitle && (
            <p
              className="mb-1 text-[8px] leading-tight"
              style={{ color: "#E0E0E0" }}
            >
              {text.subtitle}
            </p>
          )}
          {text.description && (
            <p
              className="mb-2 text-[6px] leading-relaxed line-clamp-3"
              style={{ color: "#D0D0D0" }}
            >
              {text.description}
            </p>
          )}
          {text.cta && (
            <p
              className="text-[7px] font-bold"
              style={{ color: layout?.text.cta.color || "#FFD700" }}
            >
              {text.cta}
            </p>
          )}
        </div>

        {/* Elements indicators */}
        {elements.map((el, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-sm opacity-50"
            style={{
              left: `${(el.x / 1080) * 100}%`,
              top: `${(el.y / 1350) * 100}%`,
              backgroundColor: colors.accent,
            }}
          />
        ))}

        {/* No content placeholder */}
        {!background && !text.title && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] text-[#666]">Preview do post</p>
          </div>
        )}
      </div>
    </div>
  );
}
