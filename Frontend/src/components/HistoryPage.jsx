import React, { useEffect, useState } from "react";
import { Play, Bookmark, Search, PlusCircle, Clock } from "lucide-react";
import { fetchHistory } from "../api/dashboardApi";

const ICONS = {
  Play: Play,
  Progress: Clock,
  Bookmark: Bookmark,
  Unbookmark: Bookmark,
  Search: Search,
  AddVideo: PlusCircle,
};

const LABELS = {
  Play: "Watched",
  Progress: "Progress saved for",
  Bookmark: "Bookmarked",
  Unbookmark: "Removed bookmark for",
  Search: "Searched for",
  AddVideo: "Added a new video",
};

export default function HistoryPage({ theme, userId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory(userId)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <p className="text-sm" style={{ color: theme.muted }}>Loading your history...</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>No activity yet</p>
        <p className="text-xs" style={{ color: theme.muted }}>
          Videos you watch, search, and bookmark will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {entries.map((entry, i) => {
        const Icon = ICONS[entry.activityType] || Clock;
        return (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-3 rounded-lg"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: theme.accentSoft }}
            >
              <Icon size={15} style={{ color: theme.accent }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate" style={{ color: theme.text }}>
                {LABELS[entry.activityType] || entry.activityType}{" "}
                <span style={{ color: theme.muted }}>
                  {entry.videoTitle || entry.details || ""}
                </span>
              </p>
              <p className="text-xs" style={{ color: theme.muted }}>
                {new Date(entry.occurredAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
