import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { saveWatchProgress, logActivity } from "../api/dashboardApi";

export default function PlayerModal({ video, userId, onClose }) {
  const startedAt = useRef(null);

  useEffect(() => {
    if (!video) return;
    startedAt.current = Date.now();
    logActivity(userId, "Play", video.id, null);

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt.current) / 1000;
      const estimatedDuration = video.durationSeconds || 600;
      const progressPercent = Math.min(100, (elapsedSeconds / estimatedDuration) * 100 * 1000); // 
     saveWatchProgress(userId, video.id, parseFloat(progressPercent.toFixed(2)));
    }, 5000);

    return () => clearInterval(interval);
  }, [video, userId]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-sm font-medium truncate pr-4">{video.title}</p>
          <button onClick={onClose} className="text-white/70 hover:text-white shrink-0">
            <X size={20} />
          </button>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.youTubeId}?autoplay=1`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
