namespace Barbearia.Api.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // In a real app, this would be hashed
        public string Name { get; set; }
        public string Role { get; set; } // e.g., "Admin", "Barbeiro", "Cliente"
        public string TenantId { get; set; } // For multi-tenancy
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
        public User User { get; set; }
    }
}
