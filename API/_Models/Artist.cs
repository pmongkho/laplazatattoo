namespace LaPlazaTattoo.API.Models
{
    public class Artist
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Styles { get; set; } = string.Empty; // e.g., "Black & Grey, Realism"
        public string Bio { get; set; } = string.Empty;
        public string InstagramHandle { get; set; } = string.Empty;
        public string BookingUrl { get; set; } = string.Empty;
        public bool Featured { get; set; } = false;
        public string Image { get; set; } = string.Empty;
    }
}
