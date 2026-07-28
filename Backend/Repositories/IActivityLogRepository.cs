namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public interface IActivityLogRepository
    {
        Task LogAsync(int userId, string activityType, int? videoId, string? details);
        Task<List<Models.ActivityLog>> GetHistoryAsync(int userId, int count);
    }
}
