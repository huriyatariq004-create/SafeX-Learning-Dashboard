using SafeX.Modules.GeneralDashboard.DTOs;

namespace SafeX.Modules.GeneralDashboard.Services
{
    public interface IGeneralDashboardService
    {
        Task<DashboardResponseDto> GetDashboardAsync(int userId);
        Task<PagedVideoResultDto> GetPagedVideosAsync(int? categoryId, string? search, int page, int pageSize);
        Task UpdateWatchProgressAsync(int userId, int videoId, decimal progressPercent);
        Task ToggleBookmarkAsync(int userId, int videoId, bool add);
        Task<VideoDto> AddVideoFromLinkAsync(string youTubeUrl, int categoryId, int adminUserId);
        Task LogActivityAsync(int userId, string activityType, int? videoId, string? details);
        Task<List<DTOs.HistoryEntryDto>> GetHistoryAsync(int userId);
    }
}
