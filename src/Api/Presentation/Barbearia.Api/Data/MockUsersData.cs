using Barbearia.Api.Models;
using System.Collections.Generic;

namespace Barbearia.Api.Data
{
    public static class MockUsersData
    {
        public static List<User> Users => new List<User>
        {
            new User { Id = "admin-001", Email = "admin@barbearia.com", Password = "@246!588Ai", Name = "Administrador SaaS", Role = "Admin", TenantId = "saas-admin" },
            new User { Id = "barbeiro-001", Email = "barbeiro@barbearia.com", Password = "Barbeiro123!", Name = "João Silva", Role = "Barbeiro", TenantId = "tenant-001" },
            new User { Id = "cliente-001", Email = "cliente@email.com", Password = "Cliente123!", Name = "Maria Santos", Role = "Cliente", TenantId = "tenant-001" }
        };
    }
}
