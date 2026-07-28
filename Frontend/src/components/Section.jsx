import React from "react";

export default function Section({ title, theme, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight mb-4" style={{ color: theme.text }}>
        {title}
      </h2>
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-xl"
        style={{ 
          background: theme.sectionBg || 'rgba(255,255,255,0.03)',
          border: `1px solid ${theme.border || 'rgba(255,255,255,0.05)'}`
        }}
      >
        {children}
      </div>
    </section>
  );
}
