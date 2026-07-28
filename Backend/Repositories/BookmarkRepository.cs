using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Data;
using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Repositories
{
    public class BookmarkRepository : IBookmarkRepository
    {
        private readonly ApplicationDbContext _db;
        public BookmarkRepository(ApplicationDbContext db) => _db = db;

        public async Task<List<Bookmark>> GetByUserAsync(int userId) =>
            await _db.Bookmarks.Include(b => b.Video).ThenInclude(v => v!.Category)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

        public async Task AddAsync(int userId, int videoId)
        {
            bool exists = await _db.Bookmarks.AnyAsync(b => b.UserId == userId && b.VideoId == videoId);
            if (!exists)
            {
                _db.Bookmarks.Add(new Bookmark { UserId = userId, VideoId = videoId });
                await _db.SaveChangesAsync();
            }
        }

        public async Task RemoveAsync(int userId, int videoId)
        {
            var bookmark = await _db.Bookmarks
                .FirstOrDefaultAsync(b => b.UserId == userId && b.VideoId == videoId);
            if (bookmark != null)
            {
                _db.Bookmarks.Remove(bookmark);
                await _db.SaveChangesAsync();
            }
        }
    }
}
