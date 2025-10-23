import React from "react";

const CATS = ["كل الأقسام", "ملابس شبابي", "ملابس رياضية", "بناطيل"];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      {CATS.map((c) => (
        <button
          key={c}
          className={`chip ${value === c ? "active" : ""}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
