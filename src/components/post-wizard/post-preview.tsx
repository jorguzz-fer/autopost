"use client";

import type { PostText, PostElement } from "@/types/post";

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
}: PostPreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#333] shadow-xl">
      <div
        className="relative w-full"
        style={{
          aspectRatio: "1080/1350",
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

        {/* Layer 2: Support image - bottom right */}
        {imageUrl && (
          <div
            className="absolute bottom-0 right-0 flex items-end justify-end"
            style={{ width: "55%", height: "50%", zIndex: 2 }}
          >
            <img
              src={imageUrl}
              alt="Support"
              className="max-h-full max-w-full object-contain drop-shadow-lg"
            />
          </div>
        )}

        {/* Layer 3: Text card - left side, inspired by motor-design layout */}
        {(text.hook || text.title || text.description || text.cta) && (
          <div
            className="absolute flex flex-col justify-start"
            style={{
              left: "5%",
              top: "12%",
              width: "50%",
              zIndex: 5,
            }}
          >
            {/* Hook */}
            {text.hook && (
              <p
                className="font-medium uppercase tracking-widest"
                style={{
                  fontSize: "5px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "1.5px",
                  marginBottom: "6px",
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
                  fontSize: "12px",
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                }}
              >
                {text.title}
              </h2>
            )}

            {/* Divider line */}
            <div
              style={{
                width: "18px",
                height: "1.5px",
                background: "#D4A62A",
                borderRadius: "2px",
                margin: "6px 0",
              }}
            />

            {/* Subtitle */}
            {text.subtitle && (
              <p
                className="font-light leading-relaxed"
                style={{
                  fontSize: "6px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
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
                  fontSize: "5px",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                  marginTop: "4px",
                }}
              >
                {text.description}
              </p>
            )}

            {/* CTA with golden line */}
            {text.cta && (
              <div
                className="flex items-center gap-1"
                style={{ marginTop: "8px" }}
              >
                <div
                  style={{
                    width: "1.5px",
                    height: "12px",
                    background: "#D4A62A",
                    borderRadius: "1px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "3.5px",
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Lembre-se
                  </p>
                  <p
                    className="font-semibold"
                    style={{
                      fontSize: "5.5px",
                      color: "#D4A62A",
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
            className="absolute h-2 w-2 rounded-sm opacity-50"
            style={{
              left: `${(el.x / 1080) * 100}%`,
              top: `${(el.y / 1350) * 100}%`,
              backgroundColor: "#D4A62A",
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
