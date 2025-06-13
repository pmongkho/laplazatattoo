using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public class ArtistService : IArtistService
    {
        private readonly List<Artist> _artists = new()
        {
            new Artist {
                Id = 1,
                Name = "wohu.tattoo_lpt",
                Styles = "Black & Grey, Realism",
                Bio = "Specializes in black and grey realism with years of experience.",
                InstagramHandle = "wohu.tattoo_lpt",
                BookingUrl = "https://azulatattoocompany.square.site",
                Image = "https://scontent-dfw5-2.cdninstagram.com/v/t51.2885-19/503562382_18056681636211234_2365373885510404556_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=scontent-dfw5-2.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2QHO0h57mdQgHOLxuR93mABGc0zKccn-2uRoa9yXXMvt1aSY_NwlK51HR_IJ4Qww8m8&_nc_ohc=9c5Ih9uBAjQQ7kNvwGlGPN8&_nc_gid=uBMu8zjf4BVh8VJUqNYgRg&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfPkr9upRNNrnynwfVvKh7MPl7zaSMbsmEF7mmi70Z0bIA&oe=684E8337&_nc_sid=7a9f4b",
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
