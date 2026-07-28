using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Models;

namespace SafeX.Modules.GeneralDashboard.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Video> Videos => Set<Video>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<WatchHistory> WatchHistories => Set<WatchHistory>();
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
        public DbSet<Recommendation> Recommendations => Set<Recommendation>();
       
        public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WatchHistory>().HasKey(w => w.WatchId);
           
            modelBuilder.Entity<ActivityLog>().HasKey(a => a.ActivityId);

            modelBuilder.Entity<Video>()
                .HasOne(v => v.Category)
                .WithMany()
                .HasForeignKey(v => v.CategoryId);

            modelBuilder.Entity<WatchHistory>()
                .HasOne(w => w.Video)
                .WithMany()
                .HasForeignKey(w => w.VideoId);

            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.Video)
                .WithMany()
                .HasForeignKey(b => b.VideoId);

            modelBuilder.Entity<Recommendation>()
                .HasOne(r => r.Video)
                .WithMany()
                .HasForeignKey(r => r.VideoId);

            modelBuilder.Entity<Video>().HasQueryFilter(v => v.Status != "Deleted");

            modelBuilder.Entity<ActivityLog>()
                .HasOne(a => a.Video)
                .WithMany()
                .HasForeignKey(a => a.VideoId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}