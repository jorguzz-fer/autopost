interface TextLayout {
  x: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  color: string;
  align: "left" | "center" | "right";
}

export interface CategoryLayout {
  name: string;
  colors: { primary: string; accent: string; overlay: string };
  text: {
    hook: TextLayout;
    title: TextLayout;
    subtitle: TextLayout;
    description: TextLayout;
    cta: TextLayout;
  };
  defaultElements: Array<{ key: string; x: number; y: number; scale: number }>;
}

export const CATEGORY_LAYOUTS: Record<string, CategoryLayout> = {
  Autoridade: {
    name: "Autoridade",
    colors: { primary: "#6B2D5B", accent: "#9B4DCA", overlay: "rgba(107,45,91,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#FFD700", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#FFD700", align: "center" },
    },
    defaultElements: [
      { key: "square", x: 50, y: 50, scale: 0.3 },
      { key: "diamond", x: 950, y: 1200, scale: 0.25 },
    ],
  },
  Educativo: {
    name: "Educativo",
    colors: { primary: "#2D5B3A", accent: "#4CAF50", overlay: "rgba(45,91,58,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#A5D6A7", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#A5D6A7", align: "center" },
    },
    defaultElements: [
      { key: "circle", x: 80, y: 80, scale: 0.3 },
      { key: "square", x: 920, y: 1180, scale: 0.25 },
    ],
  },
  Executivo: {
    name: "Executivo",
    colors: { primary: "#3A3A5C", accent: "#5C6BC0", overlay: "rgba(58,58,92,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#90CAF9", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#90CAF9", align: "center" },
    },
    defaultElements: [
      { key: "diamond", x: 60, y: 60, scale: 0.3 },
      { key: "circle", x: 940, y: 1200, scale: 0.25 },
    ],
  },
  Processo: {
    name: "Processo",
    colors: { primary: "#5B4B2D", accent: "#FF9800", overlay: "rgba(91,75,45,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#FFE082", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#FFE082", align: "center" },
    },
    defaultElements: [
      { key: "square", x: 70, y: 70, scale: 0.3 },
      { key: "diamond", x: 930, y: 1190, scale: 0.25 },
    ],
  },
  Inovação: {
    name: "Inovação",
    colors: { primary: "#2D4B5B", accent: "#00BCD4", overlay: "rgba(45,75,91,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#80DEEA", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#80DEEA", align: "center" },
    },
    defaultElements: [
      { key: "circle", x: 60, y: 90, scale: 0.3 },
      { key: "square", x: 940, y: 1180, scale: 0.25 },
    ],
  },
  Gestão: {
    name: "Gestão",
    colors: { primary: "#4B2D5B", accent: "#E91E63", overlay: "rgba(75,45,91,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#F48FB1", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#F48FB1", align: "center" },
    },
    defaultElements: [
      { key: "diamond", x: 70, y: 80, scale: 0.3 },
      { key: "circle", x: 930, y: 1190, scale: 0.25 },
    ],
  },
  Datas: {
    name: "Datas",
    colors: { primary: "#5B2D2D", accent: "#F44336", overlay: "rgba(91,45,45,0.6)" },
    text: {
      hook: { x: 540, y: 120, maxWidth: 900, fontSize: 28, fontWeight: "600", lineHeight: 1.3, color: "#EF9A9A", align: "center" },
      title: { x: 540, y: 280, maxWidth: 900, fontSize: 52, fontWeight: "800", lineHeight: 1.2, color: "#FFFFFF", align: "center" },
      subtitle: { x: 540, y: 450, maxWidth: 850, fontSize: 32, fontWeight: "400", lineHeight: 1.3, color: "#E0E0E0", align: "center" },
      description: { x: 540, y: 600, maxWidth: 850, fontSize: 24, fontWeight: "400", lineHeight: 1.5, color: "#D0D0D0", align: "center" },
      cta: { x: 540, y: 1200, maxWidth: 800, fontSize: 30, fontWeight: "700", lineHeight: 1.3, color: "#EF9A9A", align: "center" },
    },
    defaultElements: [
      { key: "square", x: 60, y: 60, scale: 0.3 },
      { key: "diamond", x: 940, y: 1200, scale: 0.25 },
    ],
  },
};
