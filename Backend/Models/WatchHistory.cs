using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;  

namespace SafeX.Modules.GeneralDashboard.Models
{
    [Table("WatchHistory")] 
    public class WatchHistory
    {
        [Key]
        public int WatchId { get; set; }

        public int UserId { get; set; }

        public int VideoId { get; set; }

        public decimal ProgressPercent { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime WatchedAt { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("VideoId")]
        public virtual Video? Video { get; set; }
    }
}
