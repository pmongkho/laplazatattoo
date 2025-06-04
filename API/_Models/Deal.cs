namespace LaPlazaTattoo.API.Models
{
    public class Deal
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsActive => ExpiresAt > DateTime.UtcNow;
    }
}
