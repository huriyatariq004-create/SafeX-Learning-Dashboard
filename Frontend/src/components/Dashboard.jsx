import React, { useState, useEffect, useCallback } from "react";
import { Clock, LogOut } from "lucide-react";
import { THEMES } from "../theme";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import VideoCard from "./VideoCard";
import PlayerModal from "./PlayerModal";
import Section from "./Section";
import BookmarksPage from "./BookmarksPage";
import HistoryPage from "./HistoryPage";
import { fetchDashboard, fetchPagedVideos, toggleBookmark, logActivity } from "../api/dashboardApi";
import { useAuth } from "../AuthContext";


export default function Dashboard() {
  const { user, logout } = useAuth();
  const CURRENT_USER_ID = user.userId;

  const [mode, setMode] = useState("dark");
  const theme = THEMES[mode];

  const [activeNav, setActiveNav] = useState("home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);
  const [popularPage, setPopularPage] = useState({ items: [], page: 1, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboard(CURRENT_USER_ID);
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [CURRENT_USER_ID]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const loadPopular = useCallback(async (page = 1, search = "") => {
    try {
      const categoryId = activeCategory === "all" ? undefined : activeCategory;
      const result = await fetchPagedVideos({
        categoryId: categoryId,
        search,
        page,
        pageSize: 8,
      });
      setPopularPage((prev) => ({
        items: page === 1 ? result.items : [...prev.items, ...result.items],
        page: result.page,
        hasMore: result.hasMore,
      }));
    } catch (err) {
      setError(err.message);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadPopular(1, query);
  }, [activeCategory, loadPopular]);

  const handleSearchCommit = (term) => {
    logActivity(CURRENT_USER_ID, "Search", null, term);
    loadPopular(1, term);
  };

  const handlePlay = (video) => setPlayingVideo(video);

  const bookmarkedIds = new Set((dashboardData?.bookmarks || []).map((b) => b.videoId));

  const handleBookmarkToggle = async (video) => {
    const isBookmarked = bookmarkedIds.has(video.id);
    await toggleBookmark(CURRENT_USER_ID, video.id, !isBookmarked);
    await logActivity(CURRENT_USER_ID, isBookmarked ? "Unbookmark" : "Bookmark", video.id, null);
    loadDashboard();
  };

  const pageTitle = {
    home: "Your Dashboard",
    popular: " Popular Videos",
    recommended: " Recommended For You",
    explore: "Explore",
    bookmarks: "Bookmarks",
    history: "History",
  }[activeNav];

  return (
    <div
      className="min-h-screen w-full flex transition-colors duration-300"
      style={{ background: theme.bg, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Sidebar
        theme={theme}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        mode={mode}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          theme={theme}
          mode={mode}
          setMode={setMode}
          query={query}
          setQuery={setQuery}
          onSearchCommit={handleSearchCommit}
        />

        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 pt-16 md:pt-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.text }}>
              {query ? `Results for "${query}"` : pageTitle}
            </h1>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ color: theme.muted, border: `1px solid ${theme.border}` }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>

          {error && (
            <p className="text-sm mb-4" style={{ color: "#F87171" }}>
              Couldn't reach the backend: {error}. Showing what's cached.
            </p>
          )}

          {activeNav === "bookmarks" && (
            <BookmarksPage
              theme={theme}
              bookmarks={dashboardData?.bookmarks}
              onPlay={handlePlay}
              onToggleBookmark={handleBookmarkToggle}
              loading={loading}
            />
          )}

          {activeNav === "history" && (
            <HistoryPage theme={theme} userId={CURRENT_USER_ID} />
          )}

          {activeNav === "recommended" && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold tracking-tight mb-4" style={{ color: theme.text }}>
                👍 Recommended For You
              </h2>
              {loading && !dashboardData ? (
                <p className="text-sm" style={{ color: theme.muted }}>Loading recommendations...</p>
              ) : dashboardData?.recommended?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dashboardData.recommended.map((v) => (
                    <VideoCard
                      key={v.videoId}
                      video={mapDto(v)}
                      theme={theme}
                      mode={mode}
                      onPlay={handlePlay}
                      onToggleBookmark={handleBookmarkToggle}
                      isBookmarked={bookmarkedIds.has(v.videoId)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: theme.muted }}>No recommendations yet. Watch more videos to get personalized suggestions!</p>
              )}
            </section>
          )}

          {(activeNav === "popular" || activeNav === "explore") && (
            <section className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: theme.text }}>
                  {activeNav === "popular" ? "🔥 Most Popular" : "All Videos"}
                </h2>
                <Clock size={16} style={{ color: theme.muted }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularPage.items.map((v) => (
                  <VideoCard
                    key={v.videoId}
                    video={mapDto(v)}
                    theme={theme}
                    mode={mode}
                    onPlay={handlePlay}
                    onToggleBookmark={handleBookmarkToggle}
                    isBookmarked={bookmarkedIds.has(v.videoId)}
                  />
                ))}
              </div>
              {popularPage.hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => loadPopular(popularPage.page + 1, query)}
                    className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
                    style={{ color: theme.accent, borderColor: theme.accent + "50" }}
                  >
                    Load more
                  </button>
                </div>
              )}
              {!loading && popularPage.items.length === 0 && (
                <p className="text-sm" style={{ color: theme.muted }}>No videos match your search.</p>
              )}
            </section>
          )}

          {activeNav === "home" && (
            <>
              {loading && !dashboardData && (
                <p className="text-sm" style={{ color: theme.muted }}>Loading your dashboard...</p>
              )}

              {!query && dashboardData && (
                <>
                  {dashboardData.continueWatching?.length > 0 && (
                    <Section title="Continue Watching" theme={theme}>
                      {dashboardData.continueWatching.map((v) => (
                        <VideoCard
                          key={v.videoId}
                          video={mapDto(v)}
                          showProgress
                          theme={theme}
                          mode={mode}
                          onPlay={handlePlay}
                          onToggleBookmark={handleBookmarkToggle}
                          isBookmarked={bookmarkedIds.has(v.videoId)}
                        />
                      ))}
                    </Section>
                  )}

                  {dashboardData.recommended?.length > 0 && (
                    <Section title="Recommended For You" theme={theme}>
                      {dashboardData.recommended.map((v) => (
                        <VideoCard
                          key={v.videoId}
                          video={mapDto(v)}
                          theme={theme}
                          mode={mode}
                          onPlay={handlePlay}
                          onToggleBookmark={handleBookmarkToggle}
                          isBookmarked={bookmarkedIds.has(v.videoId)}
                        />
                      ))}
                    </Section>
                  )}

                  {popularPage.items.length > 0 && (
                    <Section title="Popular Videos" theme={theme}>
                      {popularPage.items.slice(0, 8).map((v) => (
                        <VideoCard
                          key={v.videoId}
                          video={mapDto(v)}
                          theme={theme}
                          mode={mode}
                          onPlay={handlePlay}
                          onToggleBookmark={handleBookmarkToggle}
                          isBookmarked={bookmarkedIds.has(v.videoId)}
                        />
                      ))}
                    </Section>
                  )}
                </>
              )}

              {query && (
                <section className="mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {popularPage.items.map((v) => (
                      <VideoCard
                        key={v.videoId}
                        video={mapDto(v)}
                        theme={theme}
                        mode={mode}
                        onPlay={handlePlay}
                        onToggleBookmark={handleBookmarkToggle}
                        isBookmarked={bookmarkedIds.has(v.videoId)}
                      />
                    ))}
                  </div>
                  {popularPage.hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => loadPopular(popularPage.page + 1, query)}
                        className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
                        style={{ color: theme.accent, borderColor: theme.accent + "50" }}
                      >
                        Load more
                      </button>
                    </div>
                  )}
                  {!loading && popularPage.items.length === 0 && (
                    <p className="text-sm" style={{ color: theme.muted }}>No videos match your search.</p>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>

      <PlayerModal video={playingVideo} userId={CURRENT_USER_ID} onClose={() => setPlayingVideo(null)} />
    </div>
  );
}

function mapDto(dto) {
  return {
    id: dto.videoId,
    youTubeId: dto.youTubeVideoId,
    title: dto.title,
    channel: dto.channelName,
    categoryName: dto.categoryName,
    duration: dto.durationSeconds ? formatDuration(dto.durationSeconds) : null,
    durationSeconds: dto.durationSeconds,
    progressPercent: dto.progressPercent || 0,
    viewsCount: dto.viewsCount,
  };
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(m).padStart(2, "0")}`;
}