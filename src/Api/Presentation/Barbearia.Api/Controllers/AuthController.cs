using Barbearia.Api.Models;
using Barbearia.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Barbearia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _authService.Authenticate(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized(new LoginResponse { Success = false, Message = "Credenciais inválidas." });
            }

            var token = _authService.GenerateJwtToken(user);

            return Ok(new LoginResponse { Success = true, Token = token, User = user });
        }
    }
}
