using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Data;
using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public class WatchHistoryRepository : IWatchHistoryRepository
    {
        private readonly ApplicationDbContext _db;
        public WatchHistoryRepository(ApplicationDbContext db) => _db = db;

        public async Task<List<WatchHistory>> GetContinueWatchingAsync(int userId, int count) =>
            await _db.WatchHistories
                .Include(w => w.Video).ThenInclude(v => v!.Category)
                .Where(w => w.UserId == userId && !w.IsCompleted && w.ProgressPercent > 0)
                .OrderByDescending(w => w.WatchedAt)
                .Take(count)
                .ToListAsync();

        // Called live as the user watches - runtime update, no schema change needed
        public async Task UpsertProgressAsync(int userId, int videoId, decimal progressPercent)
        {
            var existing = await _db.WatchHistories
                .FirstOrDefaultAsync(w => w.UserId == userId && w.VideoId == videoId);

            if (existing == null)
            {
                _db.WatchHistories.Add(new WatchHistory
                {
                    UserId = userId,
                    VideoId = videoId,
                    ProgressPercent = progressPercent,
                    IsCompleted = progressPercent >= 95,
                    WatchedAt = DateTime.UtcNow
                });
            }
            else
            {
                existing.ProgressPercent = progressPercent;
                existing.IsCompleted = progressPercent >= 95;
                existing.WatchedAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
        }
    }
}
