using Microsoft.AspNetCore.Mvc;
using SafeX.Modules.GeneralDashboard.Services;

namespace SafeX.Modules.GeneralDashboard.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class GeneralDashboardController : ControllerBase
    {
        private readonly IGeneralDashboardService _dashboardService;

        public GeneralDashboardController(IGeneralDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        public async Task<IActionResult> GetDashboard([FromQuery] int userId)
        {
            var result = await _dashboardService.GetDashboardAsync(userId);
            return Ok(result);
        }

       
        [HttpGet("videos")]
        public async Task<IActionResult> GetPagedVideos(
            [FromQuery] int? categoryId,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 8)
        {
            var result = await _dashboardService.GetPagedVideosAsync(categoryId, search, page, pageSize);
            return Ok(result);
        }

       
        [HttpPost("progress")]
        public async Task<IActionResult> UpdateProgress([FromBody] UpdateProgressRequest request)
        {
            await _dashboardService.UpdateWatchProgressAsync(request.UserId, request.VideoId, request.ProgressPercent);
            return NoContent();
        }

       
        [HttpPost("bookmark")]
        public async Task<IActionResult> ToggleBookmark([FromBody] ToggleBookmarkRequest request)
        {
            await _dashboardService.ToggleBookmarkAsync(request.UserId, request.VideoId, request.Add);
            return NoContent();
        }

        
        [HttpPost("videos")]
        public async Task<IActionResult> AddVideo([FromBody] AddVideoRequest request)
        {
            try
            {
                var video = await _dashboardService.AddVideoFromLinkAsync(request.YouTubeUrl, request.CategoryId, request.AdminUserId);
                return Ok(video);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("activity")]
        public async Task<IActionResult> LogActivity([FromBody] LogActivityRequest request)
        {
            await _dashboardService.LogActivityAsync(request.UserId, request.ActivityType, request.VideoId, request.Details);
            return NoContent();
        }

        
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] int userId)
        {
            var history = await _dashboardService.GetHistoryAsync(userId);
            return Ok(history);
        }
    }

    public record UpdateProgressRequest(int UserId, int VideoId, decimal ProgressPercent);
    public record ToggleBookmarkRequest(int UserId, int VideoId, bool Add);
    public record AddVideoRequest(string YouTubeUrl, int CategoryId, int AdminUserId);
    public record LogActivityRequest(int UserId, string ActivityType, int? VideoId, string? Details);
}
