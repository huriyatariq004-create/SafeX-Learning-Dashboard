import React from "react";
import VideoCard from "./VideoCard";
import Section from "./Section";

export default function BookmarksPage({ theme, bookmarks, onPlay, onToggleBookmark, loading }) {
  if (loading) {
    return <p className="text-sm" style={{ color: theme.muted }}>Loading your bookmarks...</p>;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>No bookmarks yet</p>
        <p className="text-xs" style={{ color: theme.muted }}>
          Tap the bookmark icon on any video to save it here.
        </p>
      </div>
    );
  }

  return (
    <Section title={`Bookmarks (${bookmarks.length})`} theme={theme}>
      {bookmarks.map((v) => (
        <VideoCard
          key={v.videoId}
          video={mapDto(v)}
          theme={theme}
          onPlay={onPlay}
          onToggleBookmark={onToggleBookmark}
          isBookmarked
        />
      ))}
    </Section>
  );
}

function mapDto(dto) {
  return {
    id: dto.videoId,
    youTubeId: dto.youTubeVideoId,
    title: dto.title,
    channel: dto.channelName,
    duration: dto.durationSeconds ? formatDuration(dto.durationSeconds) : null,
    durationSeconds: dto.durationSeconds,
  };
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}
