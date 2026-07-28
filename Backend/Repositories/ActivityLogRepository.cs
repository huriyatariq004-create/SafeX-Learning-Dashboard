using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Data;
using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _db;
        public ActivityLogRepository(ApplicationDbContext db) => _db = db;

        public async Task LogAsync(int userId, string activityType, int? videoId, string? details)
        {
            _db.ActivityLogs.Add(new ActivityLog
            {
                UserId = userId,
                ActivityType = activityType,
                VideoId = videoId,
                Details = details,
                OccurredAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
        }

        public async Task<List<ActivityLog>> GetHistoryAsync(int userId, int count) =>
            await _db.ActivityLogs
                .Include(a => a.Video)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.OccurredAt)
                .Take(count)
                .ToListAsync();
    }
}
