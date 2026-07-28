namespace SafeX.Modules.GeneralDashboard.DTOs
{
    public class HistoryEntryDto
    {
        public string ActivityType { get; set; } = string.Empty; 
        public int? VideoId { get; set; }
        public string? VideoTitle { get; set; }
        public string? Details { get; set; }
        public DateTime OccurredAt { get; set; }
    }
}
