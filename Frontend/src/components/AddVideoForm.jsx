import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { addVideoFromLink, fetchCategories } from "../api/dashboardApi";

export default function AddVideoForm({ theme, adminUserId, onAdded }) {
  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [status, setStatus] = useState(null); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories("General")
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].categoryId);
      })
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim() || !categoryId) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const newVideo = await addVideoFromLink(url.trim(), categoryId, adminUserId);
      setStatus({ type: "success", message: "Video added to the database." });
      setUrl("");
      onAdded?.(newVideo);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center p-3 rounded-lg mb-8"
      style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a real YouTube link to add it live..."
        className="flex-1 text-sm rounded-md px-3 py-2 focus:outline-none"
        style={{ background: theme.inputBg, color: theme.text }}
      />
      <select
        value={categoryId ?? ""}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="text-sm rounded-md px-2 py-2 focus:outline-none"
        style={{ background: theme.inputBg, color: theme.text }}
      >
        {categories.map((c) => (
          <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={submitting || !categoryId}
        className="flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md transition-colors disabled:opacity-50"
        style={{ background: theme.accent, color: theme.bg }}
      >
        <Plus size={16} />
        {submitting ? "Adding..." : "Add Video"}
      </button>
      {status && (
        <span className="text-xs sm:ml-2" style={{ color: status.type === "error" ? "#F87171" : theme.accent }}>
          {status.message}
        </span>
      )}
    </form>
  );
}
