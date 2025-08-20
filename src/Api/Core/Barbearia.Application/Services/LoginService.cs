
using Barbearia.Application.Dtos;
using Barbearia.Application.Services;
using Barbearia.Domain;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Barbearia.Application.Features.Users.Commands.Login;

public class LoginService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly ILogger<LoginService> _logger;

    public LoginService(IUserRepository userRepository, ITokenService tokenService, ILogger<LoginService> logger)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        _logger.LogInformation("Attempting to log in user {Email}", request.Email);

        var user = await _userRepository.GetUserByEmailAsync(request.Email);

        if (user == null)
        {
            _logger.LogWarning("User with email {Email} not found", request.Email);
            return null;
        }

        if (!await _userRepository.ValidatePasswordAsync(user, request.Password))
        {
            _logger.LogWarning("Invalid password for user {Email}", request.Email);
            return null;
        }

        _logger.LogInformation("User {Email} logged in successfully", request.Email);

        var token = _tokenService.GenerateToken(user);

        return new LoginResponseDto { Token = token };
    }
}
