namespace SafeX.Modules.GeneralDashboard.DTOs
{
   
    public class VideoDto
    {
        public int VideoId { get; set; }
        public string YouTubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? ChannelName { get; set; }
        public int? DurationSeconds { get; set; }
        public string? CategoryName { get; set; }
        public decimal? ProgressPercent { get; set; }   
    }

    public class DashboardResponseDto
    {
        public List<VideoDto> ContinueWatching { get; set; } = new();
        public List<VideoDto> Recommended { get; set; } = new();
        public List<VideoDto> Popular { get; set; } = new();
        public List<VideoDto> Recent { get; set; } = new();
        public List<VideoDto> Bookmarks { get; set; } = new();
    }

    public class PagedVideoResultDto
    {
        public List<VideoDto> Items { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public bool HasMore { get; set; }
    }
}
