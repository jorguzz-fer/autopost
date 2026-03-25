import { createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { CATEGORY_LAYOUTS } from "./categories";
import type { RenderInput } from "@/types/post";

function wrapText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  lineHeight: number
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

function drawTextField(
  ctx: SKRSContext2D,
  text: string | undefined,
  layout: {
    x: number;
    y: number;
    maxWidth: number;
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
    color: string;
    align: "left" | "center" | "right";
  }
) {
  if (!text) return;

  ctx.fillStyle = layout.color;
  ctx.font = `${layout.fontWeight} ${layout.fontSize}px sans-serif`;
  ctx.textAlign = layout.align;
  ctx.textBaseline = "top";

  const lines = wrapText(ctx, text, layout.maxWidth, layout.fontSize, layout.lineHeight);
  const totalHeight = lines.length * layout.fontSize * layout.lineHeight;
  let y = layout.y - totalHeight / 2;

  for (const line of lines) {
    ctx.fillText(line, layout.x, y);
    y += layout.fontSize * layout.lineHeight;
  }
}

export async function renderPost(input: RenderInput): Promise<Buffer> {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  // Layer 1: Background
  if (input.background) {
    try {
      const bg = await loadImage(input.background);
      ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } catch {
      // Fallback: solid color background
      const layout = CATEGORY_LAYOUTS[input.category];
      ctx.fillStyle = layout?.colors.primary || "#1a1a1a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  } else {
    const layout = CATEGORY_LAYOUTS[input.category];
    ctx.fillStyle = layout?.colors.primary || "#1a1a1a";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Layer 2: Support image
  if (input.image?.url) {
    try {
      const img = await loadImage(input.image.url);
      ctx.drawImage(img, input.image.x, input.image.y, input.image.width, input.image.height);
    } catch {
      // Skip if image fails to load
    }
  }

  // Layer 3: Overlay for text readability
  const layout = CATEGORY_LAYOUTS[input.category];
  if (layout) {
    ctx.fillStyle = layout.colors.overlay;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Layer 4: Decorative elements
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

  // Layer 5: Text
  if (layout) {
    drawTextField(ctx, input.text.hook, layout.text.hook);
    drawTextField(ctx, input.text.title, layout.text.title);
    drawTextField(ctx, input.text.subtitle, layout.text.subtitle);
    drawTextField(ctx, input.text.description, layout.text.description);
    drawTextField(ctx, input.text.cta, layout.text.cta);
  }

  return Buffer.from(canvas.toBuffer("image/png"));
}
