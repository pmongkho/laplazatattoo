using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public class DealService : IDealService
    {
        private readonly List<Deal> _deals = new()
        {
            new Deal { Id = 1, Title = "Summer Flash Sale", Description = "$50 off any black & grey sleeve this month!", ExpiresAt = DateTime.UtcNow.AddDays(7) },
            new Deal { Id = 2, Title = "Walk-in Wednesday", Description = "First come, first served small tattoos!", ExpiresAt = DateTime.UtcNow.AddDays(3) }
        };

        public IEnumerable<Deal> GetActiveDeals() =>
            _deals.Where(d => d.IsActive);
    }
}
