using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public class ArtistService : IArtistService
    {
        private readonly List<Artist> _artists = new()
        {
            new Artist {
                Id = 1,
                Name = "wohu.tattoo",
                Styles = "Black & Grey, Realism",
                Bio = "Specializes in black and grey realism with years of experience.",
                InstagramHandle = "wohu.tattoo",
                BookingUrl = "https://azulatattoocompany.square.site",
                Featured = true
            },
            new Artist {
                Id = 2,
                Name = "Nok",
                Styles = "Neo-Traditional, Color",
                Bio = "A passionate artist who loves vibrant, bold tattoos.",
                InstagramHandle = "nok_tattoo",
                BookingUrl = "https://squareup.com/appointments/nok",
                Featured = false
            }
        };

        public IEnumerable<Artist> GetAll() => _artists;

        public Artist? GetById(int id) => _artists.FirstOrDefault(a => a.Id == id);

        public IEnumerable<Artist> SearchByStyle(string style) =>
            _artists.Where(a => a.Styles.ToLower().Contains(style.ToLower()));
    }
}
