using Barbearia.Domain;

namespace Barbearia.Application.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
