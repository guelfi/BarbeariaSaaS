using Barbearia.Application.Dtos;
using Barbearia.Application.Features.Users.Commands.Login;
using Barbearia.Application.Services;
using Barbearia.Domain;
using FluentAssertions;
using Moq;
using Xunit;
using Microsoft.Extensions.Logging;

namespace Barbearia.Application.Tests;

public class LoginServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<ILogger<LoginService>> _loggerMock;
    private readonly LoginService _loginService;

    public LoginServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        _loggerMock = new Mock<ILogger<LoginService>>();
        _loginService = new LoginService(_userRepositoryMock.Object, _tokenServiceMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ShouldReturnLoginResponseDto()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@test.com", Password = "password" };
        var user = new User { Id = 1, Email = "test@test.com", PasswordHash = "hashedpassword", Role = "user" };
        _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(loginRequest.Email)).ReturnsAsync(user);
        _userRepositoryMock.Setup(x => x.ValidatePasswordAsync(user, loginRequest.Password)).ReturnsAsync(true);
        _tokenServiceMock.Setup(x => x.GenerateToken(user)).Returns("token");

        // Act
        var result = await _loginService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<LoginResponseDto>();
        result!.Token.Should().Be("token");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ShouldReturnNull()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@test.com", Password = "password" };
        _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(loginRequest.Email)).ReturnsAsync((User?)null);

        // Act
        var result = await _loginService.LoginAsync(loginRequest);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ShouldReturnNull()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@test.com", Password = "password" };
        var user = new User { Id = 1, Email = "test@test.com", PasswordHash = "hashedpassword", Role = "user" };
        _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(loginRequest.Email)).ReturnsAsync(user);
        _userRepositoryMock.Setup(x => x.ValidatePasswordAsync(user, loginRequest.Password)).ReturnsAsync(false);

        // Act
        var result = await _loginService.LoginAsync(loginRequest);

        // Assert
        result.Should().BeNull();
    }
}
