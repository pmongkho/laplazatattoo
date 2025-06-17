using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public interface IArtistService
    {
        IEnumerable<Artist> GetAll();
        IEnumerable<Artist> SearchByStyle(string style);

        // New CRUD operations for admin functionality
        Artist Create(Artist artist);
        Artist Update(Artist artist);
        void Delete(Guid id);
        Artist? GetById(Guid id);
    }
}