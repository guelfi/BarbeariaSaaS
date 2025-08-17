using BarbeariaSaaS.Web.Admin.Models;
using BarbeariaSaaS.Web.Admin.Data;
using Microsoft.JSInterop;
using System.Text.Json;

namespace BarbeariaSaaS.Web.Admin.Services;

public class MockAuthService : IAuthService
{
    private readonly IJSRuntime _jsRuntime;
    private readonly ILogger<MockAuthService> _logger;
    
    private const string TOKEN_KEY = "barbearia_admin_token";
    private const string REFRESH_TOKEN_KEY = "barbearia_admin_refresh_token";
    private const string USER_KEY = "barbearia_admin_user";
    private const string TOKEN_EXPIRY_KEY = "barbearia_admin_token_expiry";
    
    private readonly TimeSpan TOKEN_DURATION = TimeSpan.FromHours(1);
    
    private AuthState _currentAuthState = new();
    
    public event EventHandler<AuthState>? AuthStateChanged;

    public MockAuthService(IJSRuntime jsRuntime, ILogger<MockAuthService> logger)
    {
        _jsRuntime = jsRuntime;
        _logger = logger;
    }

    public async Task<AuthResult> LoginAsync(LoginRequest credentials)
    {
        try
        {
            // Simulate API delay
            await Task.Delay(1000);
            
            var user = MockUsersData.ValidateCredentials(credentials.Email, credentials.Password);
            
            if (user == null)
            {
                _logger.LogWarning("Login failed for email: {Email}", credentials.Email);
                return new AuthResult
                {
                    Success = false,
                    Error = AuthError.InvalidCredentials,
                    Message = "Email ou senha inválidos"
                };
            }

            // Only allow admin users in admin app
            if (user.Role != UserRole.Admin)
            {
                _logger.LogWarning("Unauthorized access attempt by user: {Email}", credentials.Email);
                return new AuthResult
                {
                    Success = false,
                    Error = AuthError.InvalidCredentials,
                    Message = "Acesso não autorizado para este tipo de usuário"
                };
            }

            var token = GenerateMockToken(user);
            var refreshToken = GenerateMockRefreshToken(user);
            var tokenExpiry = DateTime.UtcNow.Add(TOKEN_DURATION);

            await SetTokenAsync(token, refreshToken);
            await SetUserAsync(user);
            await SetTokenExpiryAsync(tokenExpiry);

            _currentAuthState = new AuthState
            {
                IsAuthenticated = true,
                User = user,
                Token = token,
                RefreshToken = refreshToken,
                TokenExpiry = tokenExpiry
            };

            AuthStateChanged?.Invoke(this, _currentAuthState);

            _logger.LogInformation("User logged in successfully: {Email}", user.Email);

            return new AuthResult
            {
                Success = true,
                User = user,
                Token = token,
                RefreshToken = refreshToken,
                Message = "Login realizado com sucesso"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", credentials.Email);
            return new AuthResult
            {
                Success = false,
                Error = AuthError.UnknownError,
                Message = "Erro interno do servidor"
            };
        }
    }

    public async Task<bool> LogoutAsync()
    {
        try
        {
            await Task.Delay(500);
            
            await ClearTokensAsync();
            
            _currentAuthState = new AuthState
            {
                IsAuthenticated = false,
                User = null,
                Token = null,
                RefreshToken = null,
                TokenExpiry = null
            };

            AuthStateChanged?.Invoke(this, _currentAuthState);

            _logger.LogInformation("User logged out successfully");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return false;
        }
    }

    public async Task<AuthResult> RefreshTokenAsync()
    {
        try
        {
            var currentRefreshToken = await GetRefreshTokenAsync();
            
            if (string.IsNullOrEmpty(currentRefreshToken))
            {
                return new AuthResult
                {
                    Success = false,
                    Error = AuthError.TokenExpired,
                    Message = "Token de refresh não encontrado"
                };
            }

            var currentUser = await GetCurrentUserFromStorageAsync();
            
            if (currentUser == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Error = AuthError.UserNotFound,
                    Message = "Usuário não encontrado"
                };
            }

            var newToken = GenerateMockToken(currentUser);
            var newRefreshToken = GenerateMockRefreshToken(currentUser);
            var tokenExpiry = DateTime.UtcNow.Add(TOKEN_DURATION);

            await SetTokenAsync(newToken, newRefreshToken);
            await SetTokenExpiryAsync(tokenExpiry);

            _currentAuthState = new AuthState
            {
                IsAuthenticated = true,
                User = currentUser,
                Token = newToken,
                RefreshToken = newRefreshToken,
                TokenExpiry = tokenExpiry
            };

            AuthStateChanged?.Invoke(this, _currentAuthState);

            return new AuthResult
            {
                Success = true,
                User = currentUser,
                Token = newToken,
                RefreshToken = newRefreshToken,
                Message = "Token renovado com sucesso"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            await LogoutAsync();
            return new AuthResult
            {
                Success = false,
                Error = AuthError.TokenExpired,
                Message = "Falha ao renovar token"
            };
        }
    }

    public AuthState GetAuthState()
    {
        return _currentAuthState;
    }

    public User? GetCurrentUser()
    {
        return _currentAuthState.User;
    }

    public bool IsAuthenticated()
    {
        return _currentAuthState.IsAuthenticated && !IsTokenExpired();
    }

    public string? GetToken()
    {
        return _currentAuthState.Token;
    }

    public void SetToken(string token, string? refreshToken = null)
    {
        _ = SetTokenAsync(token, refreshToken);
    }

    public void ClearTokens()
    {
        _ = ClearTokensAsync();
    }

    public bool IsTokenExpired()
    {
        if (_currentAuthState.TokenExpiry == null)
            return true;
            
        return DateTime.UtcNow >= _currentAuthState.TokenExpiry;
    }

    public async void InitializeAuthState()
    {
        try
        {
            var token = await GetTokenAsync();
            var user = await GetCurrentUserFromStorageAsync();
            var refreshToken = await GetRefreshTokenAsync();
            var tokenExpiryStr = await GetTokenExpiryAsync();
            
            if (!string.IsNullOrEmpty(token) && user != null && !IsTokenExpiredFromString(tokenExpiryStr))
            {
                var tokenExpiry = DateTime.TryParse(tokenExpiryStr, out var expiry) ? expiry : null;
                
                _currentAuthState = new AuthState
                {
                    IsAuthenticated = true,
                    User = user,
                    Token = token,
                    RefreshToken = refreshToken,
                    TokenExpiry = tokenExpiry
                };

                AuthStateChanged?.Invoke(this, _currentAuthState);
            }
            else
            {
                await ClearTokensAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing auth state");
            await ClearTokensAsync();
        }
    }

    public void CheckTokenExpiry()
    {
        if (IsTokenExpired() && _currentAuthState.IsAuthenticated)
        {
            _ = LogoutAsync();
        }
    }

    private async Task<string?> GetTokenAsync()
    {
        try
        {
            return await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", TOKEN_KEY);
        }
        catch
        {
            return null;
        }
    }

    private async Task<string?> GetRefreshTokenAsync()
    {
        try
        {
            return await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", REFRESH_TOKEN_KEY);
        }
        catch
        {
            return null;
        }
    }

    private async Task<string?> GetTokenExpiryAsync()
    {
        try
        {
            return await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", TOKEN_EXPIRY_KEY);
        }
        catch
        {
            return null;
        }
    }

    private async Task<User?> GetCurrentUserFromStorageAsync()
    {
        try
        {
            var userJson = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", USER_KEY);
            if (string.IsNullOrEmpty(userJson))
                return null;
                
            return JsonSerializer.Deserialize<User>(userJson);
        }
        catch
        {
            return null;
        }
    }

    private async Task SetTokenAsync(string token, string? refreshToken = null)
    {
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", TOKEN_KEY, token);
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", REFRESH_TOKEN_KEY, refreshToken);
        }
    }

    private async Task SetUserAsync(User user)
    {
        var userJson = JsonSerializer.Serialize(user);
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", USER_KEY, userJson);
    }

    private async Task SetTokenExpiryAsync(DateTime expiry)
    {
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", TOKEN_EXPIRY_KEY, expiry.ToString("O"));
    }

    private async Task ClearTokensAsync()
    {
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", TOKEN_KEY);
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", REFRESH_TOKEN_KEY);
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", USER_KEY);
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", TOKEN_EXPIRY_KEY);
    }

    private bool IsTokenExpiredFromString(string? expiryStr)
    {
        if (string.IsNullOrEmpty(expiryStr))
            return true;
            
        if (DateTime.TryParse(expiryStr, out var expiry))
        {
            return DateTime.UtcNow >= expiry;
        }
        
        return true;
    }

    private string GenerateMockToken(User user)
    {
        var payload = new
        {
            userId = user.Id,
            email = user.Email,
            role = user.Role.ToString(),
            tenantId = user.TenantId,
            exp = DateTimeOffset.UtcNow.Add(TOKEN_DURATION).ToUnixTimeSeconds()
        };
        
        var payloadJson = JsonSerializer.Serialize(payload);
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(payloadJson));
    }

    private string GenerateMockRefreshToken(User user)
    {
        var payload = new
        {
            userId = user.Id,
            type = "refresh",
            exp = DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds()
        };
        
        var payloadJson = JsonSerializer.Serialize(payload);
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(payloadJson));
    }
}