using Barbearia.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Barbearia.Infrastructure.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly List<User> _users;

    public UserRepository()
    {
        _users = new List<User>
        {
            new User { Id = 1, Email = "guelfi@msn.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("@5ST73EA4x"), Role = "admin" },
            new User { Id = 2, Email = "barbeiro@barbearia.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Barbeiro123!"), Role = "barber" },
            new User { Id = 3, Email = "cliente@email.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Cliente123!"), Role = "user" }
        };
    }

    public Task<User?> GetUserByEmailAsync(string email)
    {
        var user = _users.FirstOrDefault(u => u.Email == email);
        return Task.FromResult(user);
    }

    public Task<bool> ValidatePasswordAsync(User user, string password)
    {
        return Task.FromResult(BCrypt.Net.BCrypt.Verify(password, user.PasswordHash));
    }
}
