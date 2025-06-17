using LaPlazaTattoo.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/admin/auth")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AdminAuthController> _logger;

        public AdminAuthController(IConfiguration configuration, ILogger<AdminAuthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginModel login)
        {
            try
            {
                // In a real application, you would validate against a database
                // For this example, we're using hardcoded credentials
                // TODO: Replace with proper authentication against a user store
                if (IsValidAdmin(login.Username, login.Password))
                {
                    var token = GenerateJwtToken(login.Username);
                    return Ok(new { token });
                }

                return Unauthorized("Invalid username or password");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during admin login");
                return StatusCode(500, "An error occurred during login");
            }
        }

        private bool IsValidAdmin(string username, string password)
        {
            // TODO: Replace with proper authentication logic
            // This is just a placeholder for demonstration
            var adminUsername = _configuration["AdminAuth:Username"] ?? "admin";
            var adminPassword = _configuration["AdminAuth:Password"] ?? "Admin@123";

            return username == adminUsername && password == adminPassword;
        }

        private string GenerateJwtToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? "YourSuperSecretKeyHereThatShouldBeAtLeast32BytesLong"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "LaPlazaTattoo",
                audience: _configuration["Jwt:Audience"] ?? "LaPlazaTattooClients",
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class AdminLoginModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}