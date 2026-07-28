
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeX.Modules.GeneralDashboard.Data;

namespace SafeX.Modules.GeneralDashboard.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AuthController(ApplicationDbContext db) => _db = db;

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

           
            if (user.PasswordHash != request.Password)
                return Unauthorized(new { message = "Invalid username or password." });

            if (user.Role != "General")
                return Forbid(); 

            return Ok(new LoginResponse(user.UserId, user.Username, user.Role));
        }
    }

    public record LoginRequest(string Username, string Password);
    public record LoginResponse(int UserId, string Username, string Role);
}