import { createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import type { RenderInput } from "@/types/post";

function wrapText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawTextBlock(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  fontWeight: string,
  lineHeight: number,
  color: string,
  uppercase?: boolean
): number {
  const displayText = uppercase ? text.toUpperCase() : text;
  ctx.fillStyle = color;
  ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const lines = wrapText(ctx, displayText, maxWidth);
  let currentY = y;

  for (const line of lines) {
    ctx.fillText(line, x, currentY);
    currentY += fontSize * lineHeight;
  }

  return currentY;
}

export async function renderPost(input: RenderInput): Promise<Buffer> {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  const isDark = (input.fontMode || "dark") === "dark";
  const colors = {
    hook: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
    title: isDark ? "#FFFFFF" : "#1a1a1a",
    divider: "#D4A62A",
    subtitle: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.7)",
    description: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
    ctaLabel: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
    cta: isDark ? "#D4A62A" : "#8B6914",
  };

  // Layer 1: Background
  if (input.background) {
    try {
      const bg = await loadImage(input.background);
      ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } catch {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  } else {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Layer 2: Support image - full size, aligned bottom-right
  if (input.image?.url) {
    try {
      const img = await loadImage(input.image.url);
      // Full height, maintain aspect ratio, align right
      const scale = CANVAS_HEIGHT / img.height;
      const w = img.width * scale;
      const h = CANVAS_HEIGHT;
      const x = CANVAS_WIDTH - w;
      ctx.drawImage(img, x, 0, w, h);
    } catch {
      // Skip if image fails to load
    }
  }

  // Layer 3: Decorative elements
  if (input.elements?.length) {
    for (const el of input.elements) {
      try {
        const elPath = el.key.startsWith("http")
          ? el.key
          : `${process.cwd()}/public/elements/${el.key}.png`;
        const elImg = await loadImage(elPath);
        const w = elImg.width * el.scale;
        const h = elImg.height * el.scale;
        ctx.drawImage(elImg, el.x, el.y, w, h);
      } catch {
        // Skip element if it fails
      }
    }
  }

  // Layer 4: Text - left side, filling ~60% width, ~75% height
  const marginLeft = 54;  // ~5% of 1080
  const textMaxWidth = 626; // ~58% of 1080
  let cursorY = 108; // ~8% of 1350

  // Hook (small uppercase)
  if (input.text.hook) {
    cursorY = drawTextBlock(
      ctx, input.text.hook,
      marginLeft, cursorY, textMaxWidth,
      22, "500", 1.4,
      colors.hook,
      true
    );
    cursorY += 28;
  }

  // Title (large bold)
  if (input.text.title) {
    cursorY = drawTextBlock(
      ctx, input.text.title,
      marginLeft, cursorY, textMaxWidth,
      58, "700", 1.1,
      colors.title
    );
    cursorY += 12;
  }

  // Divider line (golden)
  ctx.fillStyle = colors.divider;
  ctx.beginPath();
  ctx.roundRect(marginLeft, cursorY, 80, 6, 4);
  ctx.fill();
  cursorY += 36;

  // Subtitle
  if (input.text.subtitle) {
    cursorY = drawTextBlock(
      ctx, input.text.subtitle,
      marginLeft, cursorY, textMaxWidth,
      28, "300", 1.5,
      colors.subtitle
    );
    cursorY += 20;
  }

  // Description
  if (input.text.description) {
    cursorY = drawTextBlock(
      ctx, input.text.description,
      marginLeft, cursorY, textMaxWidth,
      24, "300", 1.6,
      colors.description
    );
    cursorY += 20;
  }

  // CTA with golden vertical line
  if (input.text.cta) {
    cursorY += 32;

    // Golden vertical bar
    ctx.fillStyle = colors.divider;
    ctx.beginPath();
    ctx.roundRect(marginLeft, cursorY, 6, 56, 4);
    ctx.fill();

    // "Lembre-se" label
    ctx.fillStyle = colors.ctaLabel;
    ctx.font = "400 16px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("LEMBRE-SE", marginLeft + 24, cursorY + 2);

    // CTA text
    ctx.fillStyle = colors.cta;
    ctx.font = "600 24px sans-serif";
    ctx.fillText(input.text.cta, marginLeft + 24, cursorY + 26);
  }

  return Buffer.from(canvas.toBuffer("image/png"));
}
