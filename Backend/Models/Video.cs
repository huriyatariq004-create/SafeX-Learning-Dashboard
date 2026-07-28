namespace SafeX.Modules.GeneralDashboard.Models
{
    public class Video
    {
        public int VideoId { get; set; }
        public string YouTubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? ChannelName { get; set; }
        public int? DurationSeconds { get; set; }
        public long? ViewsCount { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public string AudienceType { get; set; } = "General"; 
        public string? Language { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime? PublishedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
