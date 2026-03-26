"use client";

import type { PostText, PostElement, FontMode } from "@/types/post";

interface PostPreviewProps {
  background: string;
  text: PostText;
  elements: PostElement[];
  imageUrl: string;
  category: string;
  fontMode?: FontMode;
}

export default function PostPreview({
  background,
  text,
  elements,
  imageUrl,
  fontMode = "dark",
}: PostPreviewProps) {
  // Dark mode = white text on dark bg, Light mode = dark text on light bg
  const isDark = fontMode === "dark";
  const colors = {
    hook: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
    title: isDark ? "#FFFFFF" : "#1a1a1a",
    divider: isDark ? "#D4A62A" : "#D4A62A",
    subtitle: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.7)",
    description: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
    ctaLabel: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
    cta: isDark ? "#D4A62A" : "#8B6914",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#333] shadow-xl">
      <div
        className="relative"
        style={{
          width: "540px",
          height: "675px",
          backgroundColor: "#1a1a1a",
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

        {/* Layer 2: Support image - full size */}
        {imageUrl && (
          <div
            className="absolute inset-0 flex items-end justify-end"
            style={{ zIndex: 2 }}
          >
            <img
              src={imageUrl}
              alt="Support"
              className="h-full w-auto object-contain"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}

        {/* Layer 3: Text - left side, filling ~60% width, ~70% height */}
        {(text.hook || text.title || text.description || text.cta) && (
          <div
            className="absolute flex flex-col justify-start"
            style={{
              left: "5%",
              top: "8%",
              width: "58%",
              maxHeight: "80%",
              zIndex: 5,
            }}
          >
            {/* Hook */}
            {text.hook && (
              <p
                className="font-medium uppercase"
                style={{
                  fontSize: "10px",
                  color: colors.hook,
                  letterSpacing: "2px",
                  marginBottom: "10px",
                  lineHeight: 1.4,
                }}
              >
                {text.hook}
              </p>
            )}

            {/* Title */}
            {text.title && (
              <h2
                className="font-bold leading-tight"
                style={{
                  fontSize: "28px",
                  color: colors.title,
                  lineHeight: 1.1,
                }}
              >
                {text.title}
              </h2>
            )}

            {/* Divider line */}
            <div
              style={{
                width: "40px",
                height: "3px",
                background: colors.divider,
                borderRadius: "2px",
                margin: "14px 0",
              }}
            />

            {/* Subtitle */}
            {text.subtitle && (
              <p
                className="font-light leading-relaxed"
                style={{
                  fontSize: "13px",
                  color: colors.subtitle,
                  lineHeight: 1.5,
                }}
              >
                {text.subtitle}
              </p>
            )}

            {/* Description */}
            {text.description && (
              <p
                className="font-light leading-relaxed"
                style={{
                  fontSize: "11px",
                  color: colors.description,
                  lineHeight: 1.6,
                  marginTop: "10px",
                }}
              >
                {text.description}
              </p>
            )}

            {/* CTA with golden line */}
            {text.cta && (
              <div
                className="flex items-center gap-2"
                style={{ marginTop: "18px" }}
              >
                <div
                  style={{
                    width: "3px",
                    height: "28px",
                    background: colors.divider,
                    borderRadius: "2px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "7px",
                      color: colors.ctaLabel,
                      letterSpacing: "1px",
                    }}
                  >
                    Lembre-se
                  </p>
                  <p
                    className="font-semibold"
                    style={{
                      fontSize: "12px",
                      color: colors.cta,
                    }}
                  >
                    {text.cta}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Elements */}
        {elements.map((el, i) => (
          <div
            key={i}
            className="absolute rounded-sm opacity-50"
            style={{
              width: "8px",
              height: "8px",
              left: `${(el.x / 1080) * 100}%`,
              top: `${(el.y / 1350) * 100}%`,
              backgroundColor: colors.divider,
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
