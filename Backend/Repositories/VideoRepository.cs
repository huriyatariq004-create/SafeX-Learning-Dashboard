using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Data;
using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public class VideoRepository : IVideoRepository
    {
        private readonly ApplicationDbContext _db;
        public VideoRepository(ApplicationDbContext db) => _db = db;

        private IQueryable<Video> PublishedFor(string audienceType) =>
            _db.Videos.Include(v => v.Category)
                .Where(v => v.Status == "Published" && v.AudienceType == audienceType);

        public async Task<List<Video>> GetRecentAsync(string audienceType, int count) =>
            await PublishedFor(audienceType)
                .OrderByDescending(v => v.PublishedAt)
                .Take(count)
                .ToListAsync();

        public async Task<List<Video>> GetPopularAsync(string audienceType, int count) =>
            await PublishedFor(audienceType)
                .OrderByDescending(v => v.ViewsCount)
                .Take(count)
                .ToListAsync();

        public async Task<(List<Video> Items, int TotalCount)> GetPagedAsync(
            string audienceType, int? categoryId, string? search, int page, int pageSize)
        {
            var query = PublishedFor(audienceType);

            if (categoryId.HasValue)
                query = query.Where(v => v.CategoryId == categoryId.Value);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(v => v.Title.Contains(search));

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(v => v.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<List<Video>> GetByIdsAsync(IEnumerable<int> videoIds) =>
            await _db.Videos.Include(v => v.Category)
                .Where(v => videoIds.Contains(v.VideoId))
                .ToListAsync();

        // Runtime insert - called when a real YouTube link is pasted into "Add Video"
        public async Task<Video> AddVideoAsync(Video video)
        {
            _db.Videos.Add(video);
            await _db.SaveChangesAsync();
            return video;
        }

        public async Task<int> CountAsync(string audienceType) =>
            await PublishedFor(audienceType).CountAsync();
    }
}
