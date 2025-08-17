using BarbeariaSaaS.Web.Admin.Models;
using System.Security.Cryptography;
using System.Text;

namespace BarbeariaSaaS.Web.Admin.Data;

public static class MockUsersData
{
    private static readonly List<User> _users = new()
    {
        // Admin SaaS
        new User
        {
            Id = "admin-001",
            Email = "guelfi@msn.com",
            Name = "Administrador SaaS",
            Role = UserRole.Admin,
            TenantId = "saas-admin",
            IsActive = true,
            CreatedAt = new DateTime(2024, 1, 1)
        }
    };

    private static readonly Dictionary<string, string> _passwords = new()
    {
        { "guelfi@msn.com", "@5ST73EA4x" }
    };

    public static User? ValidateCredentials(string email, string password)
    {
        var user = _users.FirstOrDefault(u => 
            u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        
        if (user == null || !user.IsActive)
        {
            return null;
        }
        
        if (!_passwords.TryGetValue(user.Email, out var expectedPassword) || 
            expectedPassword != password)
        {
            return null;
        }
        
        return user;
    }
    
    public static User? GetUserByEmail(string email)
    {
        return _users.FirstOrDefault(u => 
            u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }
    
    public static User? GetUserById(string id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }
    
    public static IEnumerable<User> GetUsersByTenant(string tenantId)
    {
        return _users.Where(u => u.TenantId == tenantId);
    }
    
    public static string HashPassword(string password)
    {
        // Simple mock hash - in real app would use BCrypt or similar
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "salt123"));
        return Convert.ToBase64String(hashedBytes);
    }
    
    public static bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
    
    public static void AddUser(User user, string password)
    {
        _users.Add(user);
        _passwords[user.Email] = password;
    }
}