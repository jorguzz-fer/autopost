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
  letterSpacing?: number,
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

  // Layer 1: Background (no overlay!)
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

  // Layer 2: Support image - bottom right
  if (input.image?.url) {
    try {
      const img = await loadImage(input.image.url);
      // Position bottom-right, max 55% width, max 50% height
      const maxW = CANVAS_WIDTH * 0.55;
      const maxH = CANVAS_HEIGHT * 0.5;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = CANVAS_WIDTH - w;
      const y = CANVAS_HEIGHT - h;
      ctx.drawImage(img, x, y, w, h);
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

  // Layer 4: Text - inspired by motor-design layout
  const marginLeft = 96;
  const textMaxWidth = 500;
  let cursorY = 160;

  // Hook (small uppercase)
  if (input.text.hook) {
    cursorY = drawTextBlock(
      ctx, input.text.hook,
      marginLeft, cursorY, textMaxWidth,
      20, "500", 1.3,
      "rgba(255,255,255,0.5)",
      3, true
    );
    cursorY += 24;
  }

  // Title (large bold)
  if (input.text.title) {
    cursorY = drawTextBlock(
      ctx, input.text.title,
      marginLeft, cursorY, textMaxWidth,
      60, "700", 1.1,
      "#FFFFFF"
    );
    cursorY += 8;
  }

  // Divider line (golden)
  ctx.fillStyle = "#D4A62A";
  ctx.beginPath();
  ctx.roundRect(marginLeft, cursorY, 72, 5, 4);
  ctx.fill();
  cursorY += 32;

  // Subtitle
  if (input.text.subtitle) {
    cursorY = drawTextBlock(
      ctx, input.text.subtitle,
      marginLeft, cursorY, textMaxWidth,
      26, "300", 1.6,
      "rgba(255,255,255,0.85)"
    );
    cursorY += 12;
  }

  // Description
  if (input.text.description) {
    cursorY = drawTextBlock(
      ctx, input.text.description,
      marginLeft, cursorY, textMaxWidth,
      24, "300", 1.65,
      "rgba(255,255,255,0.7)"
    );
    cursorY += 16;
  }

  // CTA with golden vertical line
  if (input.text.cta) {
    cursorY += 28;

    // Golden vertical bar
    ctx.fillStyle = "#D4A62A";
    ctx.beginPath();
    ctx.roundRect(marginLeft, cursorY, 5, 52, 4);
    ctx.fill();

    // "Lembre-se" label
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "400 15px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("LEMBRE-SE", marginLeft + 24, cursorY + 2);

    // CTA text
    ctx.fillStyle = "#D4A62A";
    ctx.font = "600 23px sans-serif";
    ctx.fillText(input.text.cta, marginLeft + 24, cursorY + 24);
  }

  return Buffer.from(canvas.toBuffer("image/png"));
}
