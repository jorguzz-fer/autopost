"use client";

interface StepTypeProps {
  value: "FEED" | "CAROUSEL";
  onChange: (v: "FEED" | "CAROUSEL") => void;
}

export default function StepType({ value, onChange }: StepTypeProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Tipo de Post</h2>
      <div className="flex gap-3">
        {(["FEED", "CAROUSEL"] as const).map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`flex-1 rounded-xl border-2 p-4 text-center font-medium transition-colors ${
              value === type
                ? "border-[#4f8a3c] bg-[#4f8a3c]/10 text-white"
                : "border-[#444] text-[#a0a0a0] hover:border-[#666]"
            }`}
          >
            {type === "FEED" ? "Feed" : "Carrossel"}
          </button>
        ))}
      </div>
    </div>
  );
}
