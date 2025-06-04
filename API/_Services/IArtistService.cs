using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public interface IArtistService
    {
        IEnumerable<Artist> GetAll();
        Artist? GetById(int id);
        IEnumerable<Artist> SearchByStyle(string style);
    }
}
