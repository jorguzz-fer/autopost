export interface PostText {
  title: string;
  subtitle: string;
  hook: string;
  description: string;
  cta: string;
}

export interface PostElement {
  key: string;
  x: number;
  y: number;
  scale: number;
}

export interface PostImage {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderInput {
  background: string;
  text: PostText;
  elements: PostElement[];
  image?: PostImage;
  category: string;
}

export interface SheetsRow {
  rowIndex: number;
  dia: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  hook: string;
  descricao: string;
  cta: string;
  urlImg: string;
  urlBg: string;
  status: string;
  postSaida: string;
  modo: string;
}

export const CATEGORIES = [
  "Autoridade",
  "Educativo",
  "Executivo",
  "Processo",
  "Inovação",
  "Gestão",
  "Datas",
] as const;

export type Category = (typeof CATEGORIES)[number];
