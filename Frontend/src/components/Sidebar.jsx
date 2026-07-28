import React, { useState, useEffect } from "react";
import { Home, Compass, Bookmark, History, Code2, ShieldCheck, Cpu, Sparkles, Play, Menu, X, TrendingUp, ThumbsUp } from "lucide-react";
import { fetchCategories } from "../api/dashboardApi";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "popular", label: "Popular Videos", icon: TrendingUp },
  { id: "recommended", label: "Recommended", icon: ThumbsUp },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "history", label: "History", icon: History },
];

const ICONS_BY_NAME = {
  Programming: Code2,
  Cybersecurity: ShieldCheck,
  Hardware: Cpu,
};

function SidebarContent({ theme, activeNav, setActiveNav, activeCategory, setActiveCategory, categories, mode }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.accent }}>
          <Play size={16} style={{ color: theme.bg }} fill={theme.bg} />
        </div>
        <span className="font-semibold text-base tracking-tight" style={{ color: theme.text }}>SafeX</span>
      </div>

      <nav className="flex flex-col gap-1 mb-6">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-white/5"
              style={{
                color: isActive ? theme.accent : theme.muted,
                backgroundColor: isActive ? theme.accentSoft : "transparent",
              }}
            >
              <Icon size={18} />
              {item.label}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: theme.accent }} />
              )}
            </button>
          );
        })}
      </nav>

      <p className="text-xs font-medium uppercase tracking-wider px-3 mb-3" style={{ color: theme.muted }}>
        Categories
      </p>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 ${
            activeCategory === "all" ? 'font-medium' : ''
          }`}
          style={{
            color: activeCategory === "all" ? theme.text : theme.muted,
            backgroundColor: activeCategory === "all" ? theme.accentSoft : "transparent",
          }}
        >
          <Sparkles size={16} style={{ color: activeCategory === "all" ? theme.accent : theme.muted }} />
          All
        </button>
        {categories.map((cat) => {
          const Icon = ICONS_BY_NAME[cat.name] || Sparkles;
          const isActive = activeCategory === cat.categoryId;
          return (
            <button
              key={cat.categoryId}
              onClick={() => setActiveCategory(cat.categoryId)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 ${
                isActive ? 'font-medium' : ''
              }`}
              style={{
                color: isActive ? theme.accent : theme.muted,
                backgroundColor: isActive ? theme.accentSoft : "transparent",
              }}
            >
              <Icon size={16} style={{ color: isActive ? theme.accent : theme.muted }} />
              <span>{cat.name}</span>
              {isActive && (
                <span className="ml-auto text-[10px] opacity-70">●</span>
              )}
            </button>
          );
        })}
        {categories.length === 0 && (
          <p className="text-xs px-3" style={{ color: theme.muted }}>No categories yet.</p>
        )}
      </div>
    </>
  );
}

export default function Sidebar({ theme, activeNav, setActiveNav, activeCategory, setActiveCategory, mode = 'dark' }) {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchCategories("General")
      .then(data => {
        const seen = new Set();
        const unique = data.filter(cat => {
          const duplicate = seen.has(cat.name);
          seen.add(cat.name);
          return !duplicate;
        });
        setCategories(unique);
      })
      .catch(() => setCategories([]));
  }, []);

  const contentProps = { theme, activeNav, setActiveNav, activeCategory, setActiveCategory, categories, mode };

  const sidebarBg = mode === 'dark' ? 'rgba(26, 26, 46, 0.95)' : 'rgba(240, 240, 245, 0.95)';

  return (
    <>
      <aside
        className="hidden md:flex md:w-56 flex-col px-4 py-6 shrink-0 border-r transition-colors duration-300 backdrop-blur-sm"
        style={{ 
          background: sidebarBg, 
          borderColor: theme.border,
          boxShadow: mode === 'dark' ? '4px 0 20px rgba(0,0,0,0.3)' : '4px 0 20px rgba(0,0,0,0.05)'
        }}
      >
        <SidebarContent {...contentProps} />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-lg"
        style={{ background: theme.surface, color: theme.text, border: `1px solid ${theme.border}` }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div
            className="relative w-64 h-full flex flex-col px-4 py-6 overflow-y-auto backdrop-blur-sm"
            style={{ 
              background: sidebarBg,
              boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end mb-4"
              style={{ color: theme.muted }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <SidebarContent
              {...contentProps}
              setActiveNav={(id) => { setActiveNav(id); setMobileOpen(false); }}
              setActiveCategory={(id) => { setActiveCategory(id); setMobileOpen(false); }}
            />
          </div>
        </div>
      )}
    </>
  );
}