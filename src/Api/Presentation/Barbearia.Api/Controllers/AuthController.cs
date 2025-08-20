using Barbearia.Application.Dtos;
using Barbearia.Application.Features.Users.Commands.Login;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Barbearia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LoginService _loginService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(LoginService loginService, ILogger<AuthController> logger)
    {
        _loginService = loginService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        _logger.LogInformation("Received login request for email {Email}", request.Email);

        var response = await _loginService.LoginAsync(request);

        if (response == null)
        {
            _logger.LogWarning("Login failed for email {Email}", request.Email);
            return Unauthorized();
        }

        _logger.LogInformation("Login successful for email {Email}", request.Email);

        return Ok(response);
    }
}
