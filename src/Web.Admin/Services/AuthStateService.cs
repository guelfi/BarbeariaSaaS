using BarbeariaSaaS.Web.Admin.Models;

namespace BarbeariaSaaS.Web.Admin.Services;

public class AuthStateService
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthStateService> _logger;
    
    public AuthState CurrentState { get; private set; } = new();
    
    public event EventHandler<AuthState>? StateChanged;

    public AuthStateService(IAuthService authService, ILogger<AuthStateService> logger)
    {
        _authService = authService;
        _logger = logger;
        
        _authService.AuthStateChanged += OnAuthStateChanged;
        
        // Initialize state
        CurrentState = _authService.GetAuthState();
    }

    private void OnAuthStateChanged(object? sender, AuthState newState)
    {
        CurrentState = newState;
        StateChanged?.Invoke(this, newState);
        
        _logger.LogInformation("Auth state changed. IsAuthenticated: {IsAuthenticated}", 
            newState.IsAuthenticated);
    }

    public bool IsAuthenticated => CurrentState.IsAuthenticated;
    
    public User? CurrentUser => CurrentState.User;
    
    public string? CurrentToken => CurrentState.Token;
    
    public bool IsAdmin => CurrentUser?.Role == UserRole.Admin;
    
    public string GetUserDisplayName()
    {
        return CurrentUser?.Name ?? "Usuário";
    }
    
    public string GetUserInitials()
    {
        if (CurrentUser?.Name == null) return "U";
        
        var parts = CurrentUser.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length >= 2)
        {
            return $"{parts[0][0]}{parts[^1][0]}".ToUpper();
        }
        
        return CurrentUser.Name[0].ToString().ToUpper();
    }
}