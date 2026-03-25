"use client";

import { CATEGORIES } from "@/types/post";
import { CATEGORY_COLORS } from "@/lib/constants";

interface StepCategoryProps {
  value: string;
  onChange: (v: string) => void;
}

export default function StepCategory({ value, onChange }: StepCategoryProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Categoria</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const colors = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`rounded-xl border-2 p-4 text-center text-sm font-medium transition-all ${
                value === cat
                  ? "border-white text-white scale-105"
                  : "border-transparent text-white/80 hover:scale-102 hover:border-white/30"
              }`}
              style={{ backgroundColor: colors?.primary || "#333" }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
