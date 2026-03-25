"use client";

import type { PostElement } from "@/types/post";

interface StepElementsProps {
  value: PostElement[];
  onChange: (v: PostElement[]) => void;
}

const AVAILABLE_ELEMENTS = [
  { key: "square", label: "Quadrado", defaultX: 50, defaultY: 50 },
  { key: "diamond", label: "Losango", defaultX: 950, defaultY: 1200 },
  { key: "circle", label: "Círculo", defaultX: 80, defaultY: 1180 },
];

export default function StepElements({ value, onChange }: StepElementsProps) {
  const isSelected = (key: string) => value.some((e) => e.key === key);

  const toggle = (el: (typeof AVAILABLE_ELEMENTS)[number]) => {
    if (isSelected(el.key)) {
      onChange(value.filter((e) => e.key !== el.key));
    } else {
      onChange([
        ...value,
        { key: el.key, x: el.defaultX, y: el.defaultY, scale: 0.3 },
      ]);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Elementos Decorativos</h2>
      <p className="mb-4 text-sm text-[#a0a0a0]">
        Selecione os elementos para compor o design. (Opcional)
      </p>
      <div className="grid grid-cols-3 gap-4">
        {AVAILABLE_ELEMENTS.map((el) => (
          <button
            key={el.key}
            onClick={() => toggle(el)}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
              isSelected(el.key)
                ? "border-[#4f8a3c] bg-[#4f8a3c]/10"
                : "border-[#444] hover:border-[#666]"
            }`}
          >
            <div
              className={`h-16 w-16 ${
                el.key === "circle"
                  ? "rounded-full"
                  : el.key === "diamond"
                  ? "rotate-45 rounded-md"
                  : "rounded-md"
              } ${
                isSelected(el.key) ? "bg-[#4f8a3c]" : "bg-[#555]"
              }`}
            />
            <span className="text-sm text-white">{el.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
