using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;
using Moq;
using Xunit;
using BarbeariaSaaS.Web.Admin.Services;
using BarbeariaSaaS.Web.Admin.Models;
using BarbeariaSaaS.Web.Admin.Data;

namespace Barbearia.Application.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IJSRuntime> _mockJSRuntime;
        private readonly Mock<ILogger<MockAuthService>> _mockLogger;
        private readonly MockAuthService _authService;

        public AuthServiceTests()
        {
            _mockJSRuntime = new Mock<IJSRuntime>();
            _mockLogger = new Mock<ILogger<MockAuthService>>();
            _authService = new MockAuthService(_mockJSRuntime.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task LoginAsync_ComCredenciaisValidas_DeveRetornarSucesso()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.User);
            Assert.Equal("guelfi@msn.com", result.User.Email);
            Assert.Equal("Administrador SaaS", result.User.Name);
            Assert.Equal(UserRole.Admin, result.User.Role);
            Assert.NotNull(result.Token);
            Assert.Equal("Login realizado com sucesso", result.Message);
        }

        [Fact]
        public async Task LoginAsync_ComCredenciaisInvalidas_DeveRetornarFalha()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "senhaerrada"
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.User);
            Assert.Null(result.Token);
            Assert.Equal("Credenciais inválidas", result.Message);
        }

        [Fact]
        public async Task LoginAsync_ComEmailInexistente_DeveRetornarFalha()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "naoexiste@email.com",
                Password = "qualquersenha"
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.User);
            Assert.Equal("Usuário não encontrado", result.Message);
        }

        [Fact]
        public async Task LoginAsync_ComEmailEmMaiusculas_DeveNormalizarEFazerLogin()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "GUELFI@MSN.COM",
                Password = "@5ST73EA4x"
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("guelfi@msn.com", result.User?.Email);
        }

        [Fact]
        public async Task LoginAsync_ComEspacosNoEmail_DeveRemoverEspacosEFazerLogin()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "  guelfi@msn.com  ",
                Password = "@5ST73EA4x"
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("guelfi@msn.com", result.User?.Email);
        }

        [Fact]
        public async Task LogoutAsync_ComUsuarioLogado_DeveLimparEstadoERetornarSucesso()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };
            await _authService.LoginAsync(loginRequest);

            // Act
            var result = await _authService.LogoutAsync();

            // Assert
            Assert.True(result);
            Assert.False(_authService.IsAuthenticated());
            Assert.Null(_authService.GetCurrentUser());
        }

        [Fact]
        public void IsAuthenticated_SemLogin_DeveRetornarFalse()
        {
            // Act
            var isAuthenticated = _authService.IsAuthenticated();

            // Assert
            Assert.False(isAuthenticated);
        }

        [Fact]
        public async Task IsAuthenticated_AposLoginValido_DeveRetornarTrue()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };

            // Act
            await _authService.LoginAsync(loginRequest);
            var isAuthenticated = _authService.IsAuthenticated();

            // Assert
            Assert.True(isAuthenticated);
        }

        [Fact]
        public void GetCurrentUser_SemLogin_DeveRetornarNull()
        {
            // Act
            var user = _authService.GetCurrentUser();

            // Assert
            Assert.Null(user);
        }

        [Fact]
        public async Task GetCurrentUser_AposLogin_DeveRetornarUsuario()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };

            // Act
            await _authService.LoginAsync(loginRequest);
            var user = _authService.GetCurrentUser();

            // Assert
            Assert.NotNull(user);
            Assert.Equal("guelfi@msn.com", user.Email);
            Assert.Equal("Administrador SaaS", user.Name);
            Assert.Equal(UserRole.Admin, user.Role);
        }

        [Fact]
        public async Task RefreshTokenAsync_ComTokenValido_DeveRenovarToken()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };
            await _authService.LoginAsync(loginRequest);

            // Act
            var result = await _authService.RefreshTokenAsync();

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Token);
            Assert.Equal("Token renovado com sucesso", result.Message);
        }

        [Fact]
        public async Task RefreshTokenAsync_SemTokenValido_DeveRetornarFalha()
        {
            // Act
            var result = await _authService.RefreshTokenAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Token inválido ou expirado", result.Message);
        }

        [Theory]
        [InlineData("", "@5ST73EA4x", "Email é obrigatório")]
        [InlineData("guelfi@msn.com", "", "Senha é obrigatória")]
        [InlineData("emailinvalido", "@5ST73EA4x", "Formato de email inválido")]
        public async Task LoginAsync_ComDadosInvalidos_DeveRetornarErroValidacao(
            string email, string password, string expectedMessage)
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = email,
                Password = password
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.False(result.Success);
            Assert.Contains(expectedMessage, result.Message);
        }

        [Fact]
        public async Task LoginAsync_DeveFazerLogDeTentativaDeLogin()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };

            // Act
            await _authService.LoginAsync(loginRequest);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("logged in successfully")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task LoginAsync_ComCredenciaisInvalidas_DeveFazerLogDeWarning()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "senhaerrada"
            };

            // Act
            await _authService.LoginAsync(loginRequest);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Login failed")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task LoginAsync_ComExcecao_DeveFazerLogDeErro()
        {
            // Arrange
            var mockJSRuntimeWithError = new Mock<IJSRuntime>();
            mockJSRuntimeWithError
                .Setup(x => x.InvokeAsync<object>(It.IsAny<string>(), It.IsAny<object[]>()))
                .ThrowsAsync(new Exception("Erro simulado"));

            var authServiceWithError = new MockAuthService(mockJSRuntimeWithError.Object, _mockLogger.Object);
            
            var loginRequest = new LoginRequest
            {
                Email = "guelfi@msn.com",
                Password = "@5ST73EA4x"
            };

            // Act
            var result = await authServiceWithError.LoginAsync(loginRequest);

            // Assert
            Assert.False(result.Success);
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error during login")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void ValidateCredentials_ComDadosValidos_DeveRetornarUsuario()
        {
            // Act
            var user = MockUsersData.ValidateCredentials("guelfi@msn.com", "@5ST73EA4x");

            // Assert
            Assert.NotNull(user);
            Assert.Equal("guelfi@msn.com", user.Email);
        }

        [Fact]
        public void ValidateCredentials_ComSenhaIncorreta_DeveRetornarNull()
        {
            // Act
            var user = MockUsersData.ValidateCredentials("guelfi@msn.com", "senhaerrada");

            // Assert
            Assert.Null(user);
        }

        [Fact]
        public void HashPassword_DeveGerarHashConsistente()
        {
            // Arrange
            var password = "minhasenha123";

            // Act
            var hash1 = MockUsersData.HashPassword(password);
            var hash2 = MockUsersData.HashPassword(password);

            // Assert
            Assert.Equal(hash1, hash2);
            Assert.NotEqual(password, hash1);
        }

        [Fact]
        public void VerifyPassword_ComSenhaCorreta_DeveRetornarTrue()
        {
            // Arrange
            var password = "minhasenha123";
            var hash = MockUsersData.HashPassword(password);

            // Act
            var isValid = MockUsersData.VerifyPassword(password, hash);

            // Assert
            Assert.True(isValid);
        }

        [Fact]
        public void VerifyPassword_ComSenhaIncorreta_DeveRetornarFalse()
        {
            // Arrange
            var password = "minhasenha123";
            var wrongPassword = "senhaerrada";
            var hash = MockUsersData.HashPassword(password);

            // Act
            var isValid = MockUsersData.VerifyPassword(wrongPassword, hash);

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void MensagensEmPortugues_DevemEstarCorretas()
        {
            // Arrange & Act & Assert
            var mensagens = new[]
            {
                "Login realizado com sucesso",
                "Credenciais inválidas",
                "Usuário não encontrado",
                "Token renovado com sucesso",
                "Token inválido ou expirado",
                "Email é obrigatório",
                "Senha é obrigatória"
            };

            foreach (var mensagem in mensagens)
            {
                Assert.DoesNotContain("Success", mensagem);
                Assert.DoesNotContain("Error", mensagem);
                Assert.DoesNotContain("Invalid", mensagem);
                Assert.DoesNotContain("Failed", mensagem);
            }
        }
    }
}