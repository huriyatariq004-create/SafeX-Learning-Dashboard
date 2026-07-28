using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public interface IWatchHistoryRepository
    {
        Task<List<WatchHistory>> GetContinueWatchingAsync(int userId, int count);
        Task UpsertProgressAsync(int userId, int videoId, decimal progressPercent);
    }
}
