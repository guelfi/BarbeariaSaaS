namespace Barbearia.Domain;

public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<bool> ValidatePasswordAsync(User user, string password);
}
