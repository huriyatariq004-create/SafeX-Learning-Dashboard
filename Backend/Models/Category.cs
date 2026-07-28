namespace SafeX.Modules.GeneralDashboard.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AudienceType { get; set; } = "General";
        public int? ParentCategoryId { get; set; }
        public string? IconUrl { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
