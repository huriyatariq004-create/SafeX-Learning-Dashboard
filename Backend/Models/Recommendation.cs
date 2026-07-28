namespace SafeX.Modules.GeneralDashboard.Models
{
    public class Recommendation
    {
        public int RecommendationId { get; set; }
        public int VideoId { get; set; }
        public Video? Video { get; set; }
        public int? SuggestedForUser { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
