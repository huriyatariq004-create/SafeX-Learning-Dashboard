
import React from "react";
import { Search, Sun, Moon } from "lucide-react";

export default function TopBar({ theme, mode, setMode, query, setQuery, onSearchCommit }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchCommit(query);
    }
  };

  return (
    <div
      className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-3 border-b transition-colors duration-300"
      style={{ background: theme.surface, borderColor: theme.border }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-md transition-all duration-300 focus-within:ring-2"
        style={{
          background: theme.searchBg || 'rgba(255,255,255,0.06)',
          border: `1px solid ${theme.searchBorder || theme.border || 'rgba(255,255,255,0.08)'}`,
          ringColor: theme.accent,
        }}
      >
        <Search size={18} style={{ color: theme.muted }} />
        <input
          type="text"
          placeholder="Search all videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm focus:outline-none"
          style={{ color: theme.text }}
          placeholder="Search all videos..."
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              onSearchCommit("");
            }}
            className="text-xs"
            style={{ color: theme.muted }}
          >
            ✕
          </button>
        )}
      </div>
      <button
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg transition-colors hover:bg-white/5"
        style={{ color: theme.muted }}
        aria-label="Toggle theme"
      >
        {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
