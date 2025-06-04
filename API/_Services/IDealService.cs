using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public interface IDealService
    {
        IEnumerable<Deal> GetActiveDeals();
    }
}
