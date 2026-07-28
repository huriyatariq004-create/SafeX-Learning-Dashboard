using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SafeX.Modules.GeneralDashboard.Models;
using SafeX.Modules.GeneralDashboard.Data;

namespace SafeX.Modules.GeneralDashboard.Models
{
    [Table("ActivityLog")]
    public class ActivityLog
    {
        [Key]
        public int ActivityId { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(30)]
        public string ActivityType { get; set; } = string.Empty;

        public int? VideoId { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }

        public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("VideoId")]
        public virtual Video? Video { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}