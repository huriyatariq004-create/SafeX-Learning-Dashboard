using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public interface IVideoRepository
    {
        Task<List<Video>> GetRecentAsync(string audienceType, int count);
        Task<List<Video>> GetPopularAsync(string audienceType, int count);
        Task<(List<Video> Items, int TotalCount)> GetPagedAsync(string audienceType, int? categoryId, string? search, int page, int pageSize);
        Task<List<Video>> GetByIdsAsync(IEnumerable<int> videoIds);
        Task<Video> AddVideoAsync(Video video);
        Task<int> CountAsync(string audienceType);
    }
}
