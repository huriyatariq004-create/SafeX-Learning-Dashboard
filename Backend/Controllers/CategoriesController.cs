using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Data;

namespace SafeX.Modules.GeneralDashboard.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public CategoriesController(ApplicationDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] string audience = "General")
        {
            var categories = await _db.Categories
                .Where(c => c.AudienceType == audience && c.IsActive)
                .OrderBy(c => c.Name)
                .Select(c => new { c.CategoryId, c.Name, c.IconUrl, c.ParentCategoryId })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
