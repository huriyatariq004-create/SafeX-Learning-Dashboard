import React from "react";
import { Play, Bookmark } from "lucide-react";

export const thumbFor = (youTubeId) => {
  if (!youTubeId) {
    return 'https://via.placeholder.com/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  }
  return `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
};

export default function VideoCard({ video, showProgress, theme, onPlay, onToggleBookmark, isBookmarked, mode = 'dark' }) {
  if (!video || !video.youTubeId) {
    return null;
  }

  const thumbnailUrl = thumbFor(video.youTubeId);

 
  const categoryBgColor = mode === 'dark' ? 'rgba(26, 26, 46, 0.7)' : 'rgba(240, 240, 245, 0.8)';
  const categoryTextColor = mode === 'dark' ? '#a0a0b8' : '#4a4a60';

  return (
    <div 
      className="group text-left w-full rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
      style={{ 
        background: theme.cardBg || 'rgba(255,255,255,0.05)',
        border: `1px solid ${theme.border || 'rgba(255,255,255,0.05)'}`,
        boxShadow: theme.shadow || '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <button onClick={() => onPlay(video)} className="block w-full focus:outline-none">
        <div className="relative w-full aspect-video overflow-hidden bg-black/20">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/320x180/1a1a2e/ffffff?text=No+Thumbnail';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <Play size={28} className="text-white" fill="white" />
          </div>
          {video.duration && (
            <span className="absolute bottom-1.5 right-1.5 text-[11px] font-medium bg-black/70 text-white px-1.5 py-0.5 rounded">
              {video.duration}
            </span>
          )}
          {showProgress && video.progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="h-full" style={{ width: `${Math.min(video.progressPercent, 100)}%`, background: theme.accent }} />
            </div>
          )}
        </div>
      </button>

      <div className="flex items-start justify-between gap-2 p-3">
        <button onClick={() => onPlay(video)} className="min-w-0 flex-1 text-left focus:outline-none">
          <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: theme.text }}>
            {video.title}
          </p>
          <p className="text-xs mt-1" style={{ color: theme.muted }}>{video.channel}</p>
          
        
          {video.categoryName && (
            <span 
              className="text-xs px-2 py-1 rounded-full inline-block mt-1.5 font-medium"
              style={{ 
                background: categoryBgColor,
                color: categoryTextColor,
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
              }}
            >
              {video.categoryName}
            </span>
          )}
        </button>

        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(video)}
            className="shrink-0 mt-1 p-1.5 rounded-full hover:bg-white/5 transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark
              size={16}
              style={{ color: isBookmarked ? theme.accent : theme.muted }}
              fill={isBookmarked ? theme.accent : "none"}
            />
          </button>
        )}
      </div>
    </div>
  );
}