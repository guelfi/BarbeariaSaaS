using System.ComponentModel.DataAnnotations;

namespace BarbeariaSaaS.Web.Admin.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string TenantId { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public enum UserRole
{
    Admin,
    Barbeiro,
    Recepcionista,
    Cliente
}

public class LoginRequest
{
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória")]
    [MinLength(6, ErrorMessage = "Senha deve ter pelo menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}

public class AuthResult
{
    public bool Success { get; set; }
    public User? User { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public AuthError? Error { get; set; }
    public string? Message { get; set; }
}

public class AuthState
{
    public bool IsAuthenticated { get; set; }
    public User? User { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? TokenExpiry { get; set; }
}

public enum AuthError
{
    InvalidCredentials,
    UserNotFound,
    UserInactive,
    TokenExpired,
    NetworkError,
    UnknownError
}