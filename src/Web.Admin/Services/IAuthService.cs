using BarbeariaSaaS.Web.Admin.Models;

namespace BarbeariaSaaS.Web.Admin.Services;

public interface IAuthService
{
    // Authentication methods
    Task<AuthResult> LoginAsync(LoginRequest credentials);
    Task<bool> LogoutAsync();
    Task<AuthResult> RefreshTokenAsync();
    
    // State management
    AuthState GetAuthState();
    User? GetCurrentUser();
    bool IsAuthenticated();
    
    // Token management
    string? GetToken();
    void SetToken(string token, string? refreshToken = null);
    void ClearTokens();
    bool IsTokenExpired();
    
    // Utility methods
    void InitializeAuthState();
    void CheckTokenExpiry();
    
    // Events
    event EventHandler<AuthState>? AuthStateChanged;
}