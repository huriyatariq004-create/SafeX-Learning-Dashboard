using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public interface IBookmarkRepository
    {
        Task<List<Bookmark>> GetByUserAsync(int userId);
        Task AddAsync(int userId, int videoId);
        Task RemoveAsync(int userId, int videoId);
    }
}
