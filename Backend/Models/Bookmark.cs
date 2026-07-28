namespace SafeX.Modules.GeneralDashboard.Models
{
    public class Bookmark
    {
        public int BookmarkId { get; set; }
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public Video? Video { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
