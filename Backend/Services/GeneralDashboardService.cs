using SafeX.Modules.GeneralDashboard.DTOs;
using SafeX.Modules.GeneralDashboard.Models;
using SafeX.Modules.GeneralDashboard.Repositories;

namespace SafeX.Modules.GeneralDashboard.Services
{
    public class GeneralDashboardService : IGeneralDashboardService
    {
        private readonly IVideoRepository _videoRepo;
        private readonly IWatchHistoryRepository _watchRepo;
        private readonly IBookmarkRepository _bookmarkRepo;
        private readonly IActivityLogRepository _activityRepo;
        private const string Audience = "General";
        private const int MaxVideosPerAudience = 20;

        public GeneralDashboardService(
            IVideoRepository videoRepo,
            IWatchHistoryRepository watchRepo,
            IBookmarkRepository bookmarkRepo,
            IActivityLogRepository activityRepo)
        {
            _videoRepo = videoRepo;
            _watchRepo = watchRepo;
            _bookmarkRepo = bookmarkRepo;
            _activityRepo = activityRepo;
        }

        public async Task<DashboardResponseDto> GetDashboardAsync(int userId)
        {
            var continueWatching = await _watchRepo.GetContinueWatchingAsync(userId, 6);
            var recent = await _videoRepo.GetRecentAsync(Audience, 8);
            var popular = await _videoRepo.GetPopularAsync(Audience, 8);
            var bookmarks = await _bookmarkRepo.GetByUserAsync(userId);

           
            var excludeIds = continueWatching.Select(w => w.VideoId)
                .Concat(bookmarks.Select(b => b.VideoId))
                .ToHashSet();
            var recommended = recent.Where(v => !excludeIds.Contains(v.VideoId)).Take(4).ToList();

            return new DashboardResponseDto
            {
                ContinueWatching = continueWatching.Select(w => MapToDto(w.Video!, w.ProgressPercent)).ToList(),
                Recommended = recommended.Select(v => MapToDto(v, null)).ToList(),
                Popular = popular.Select(v => MapToDto(v, null)).ToList(),
                Recent = recent.Select(v => MapToDto(v, null)).ToList(),
                Bookmarks = bookmarks.Select(b => MapToDto(b.Video!, null)).ToList()
            };
        }

        public async Task<PagedVideoResultDto> GetPagedVideosAsync(int? categoryId, string? search, int page, int pageSize)
        {
            var (items, totalCount) = await _videoRepo.GetPagedAsync(Audience, categoryId, search, page, pageSize);
            return new PagedVideoResultDto
            {
                Items = items.Select(v => MapToDto(v, null)).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                HasMore = page * pageSize < totalCount
            };
        }

        public Task UpdateWatchProgressAsync(int userId, int videoId, decimal progressPercent) =>
            _watchRepo.UpsertProgressAsync(userId, videoId, progressPercent);

        public Task ToggleBookmarkAsync(int userId, int videoId, bool add) =>
            add ? _bookmarkRepo.AddAsync(userId, videoId) : _bookmarkRepo.RemoveAsync(userId, videoId);
        public async Task<VideoDto> AddVideoFromLinkAsync(string youTubeUrl, int categoryId, int adminUserId)
        {
            var currentCount = await _videoRepo.CountAsync(Audience);
            if (currentCount >= MaxVideosPerAudience)
                throw new InvalidOperationException($"Video limit of {MaxVideosPerAudience} reached for this audience.");

            var youTubeId = ExtractYouTubeId(youTubeUrl);

            var video = new Video
            {
                YouTubeVideoId = youTubeId,
                Title = "Untitled (edit after import)", 
                CategoryId = categoryId,
                AudienceType = Audience,
                Status = "Published",
                PublishedAt = DateTime.UtcNow,
                CreatedBy = adminUserId,
                CreatedAt = DateTime.UtcNow
            };

            var saved = await _videoRepo.AddVideoAsync(video);
            await _activityRepo.LogAsync(adminUserId, "AddVideo", saved.VideoId, youTubeId);

            return MapToDto(saved, null);
        }

        public Task LogActivityAsync(int userId, string activityType, int? videoId, string? details) =>
            _activityRepo.LogAsync(userId, activityType, videoId, details);

        public async Task<List<DTOs.HistoryEntryDto>> GetHistoryAsync(int userId)
        {
            var entries = await _activityRepo.GetHistoryAsync(userId, 100);
            return entries.Select(e => new DTOs.HistoryEntryDto
            {
                ActivityType = e.ActivityType,
                VideoId = e.VideoId,
                VideoTitle = e.Video?.Title,
                Details = e.Details,
                OccurredAt = e.OccurredAt
            }).ToList();
        }

        private static string ExtractYouTubeId(string urlOrId)
        {
            if (urlOrId.Length == 11 && !urlOrId.Contains('/'))
                return urlOrId; 

            var uri = new Uri(urlOrId);
            if (uri.Host.Contains("youtu.be"))
                return uri.AbsolutePath.Trim('/');

            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            if (query.TryGetValue("v", out var videoId))
                return videoId.ToString();

            return uri.Segments.Last().Trim('/');
        }

        private static VideoDto MapToDto(Video v, decimal? progress) => new()
        {
            VideoId = v.VideoId,
            YouTubeVideoId = v.YouTubeVideoId,
            Title = v.Title,
            ThumbnailUrl = v.ThumbnailUrl ?? $"https://img.youtube.com/vi/{v.YouTubeVideoId}/hqdefault.jpg",
            ChannelName = v.ChannelName,
            DurationSeconds = v.DurationSeconds,
            CategoryName = v.Category?.Name,
            ProgressPercent = progress
        };
    }
}
