namespace LaPlazaTattoo.API.Models
{
    public class ConsultationRequest
    {
        public int Id { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PreferredArtist { get; set; }
        public string Style { get; set; } = string.Empty;
        public string Placement { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public List<string> ReferenceImages { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
