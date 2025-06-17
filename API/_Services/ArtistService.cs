using LaPlazaTattoo.API.Models;
using Microsoft.EntityFrameworkCore; // Ensure this is present if using EF Core methods
using LaPlazaTattoo.API.Data; // <-- Add this using directive

namespace LaPlazaTattoo.API.Services
{
    public class ArtistService : IArtistService
    {
        private readonly AppDbContext _context;

        public ArtistService(AppDbContext context)
        {
            _context = context;
        }
        public Artist? GetById(Guid id)
        {
            return _context.Artists.FirstOrDefault(a => a.Id == id);
        }
        public IEnumerable<Artist> GetAll() => _context.Artists.ToList();
        public IEnumerable<Artist> SearchByStyle(string style) =>
                    _context.Artists.Where(a => a.Styles.ToLower().Contains(style.ToLower()));

        public Artist Create(Artist artist)
        {
            _context.Artists.Add(artist);
            _context.SaveChanges();
            return artist;
        }

        public Artist Update(Artist artist)
        {
            _context.Artists.Update(artist);
            _context.SaveChanges();
            return artist;
        }
        public void Delete(Guid id)
        {
            var artist = _context.Artists.FirstOrDefault(a => a.Id == id);
            if (artist != null)
            {
                _context.Artists.Remove(artist);
                _context.SaveChanges();
            }
        }
    }
}