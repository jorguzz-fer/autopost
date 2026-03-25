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
  const colors = layout?.colors || { primary: "#1a1a1a", accent: "#4f8a3c", overlay: "rgba(0,0,0,0.5)" };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#333] shadow-xl">
      <div
        className="relative"
        style={{
          aspectRatio: "1080/1350",
          backgroundColor: colors.primary,
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

        {/* Layer 2: Support image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Support"
            className="absolute bottom-0 left-0 h-[48%] w-full object-cover"
          />
        )}

        {/* Layer 3: Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: colors.overlay }}
        />

        {/* Layer 4: Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          {text.hook && (
            <p
              className="mb-2 text-[0.5rem] font-semibold leading-tight"
              style={{ color: layout?.text.hook.color || "#FFD700" }}
            >
              {text.hook}
            </p>
          )}
          {text.title && (
            <h2
              className="mb-2 text-base font-extrabold leading-tight"
              style={{ color: "#FFFFFF" }}
            >
              {text.title}
            </h2>
          )}
          {text.subtitle && (
            <p
              className="mb-2 text-[0.6rem] leading-tight"
              style={{ color: "#E0E0E0" }}
            >
              {text.subtitle}
            </p>
          )}
          {text.description && (
            <p
              className="mb-3 text-[0.45rem] leading-relaxed"
              style={{ color: "#D0D0D0" }}
            >
              {text.description}
            </p>
          )}
          {text.cta && (
            <p
              className="mt-auto text-[0.5rem] font-bold"
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
            className="absolute h-3 w-3 rounded-sm opacity-50"
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
            <p className="text-sm text-[#666]">Preview do post</p>
          </div>
        )}
      </div>
    </div>
  );
}
