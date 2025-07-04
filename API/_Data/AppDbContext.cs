using LaPlazaTattoo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LaPlazaTattoo.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ConsultationRequest> ConsultationRequests { get; set; }
        public DbSet<Artist> Artists { get; set; } // <-- Add this line


        // Optional: Configure model properties if needed (e.g., column names, constraints)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example: Configure the Id to be generated by the database
            modelBuilder.Entity<ConsultationRequest>()
                .Property(c => c.Id)
                .ValueGeneratedOnAdd();
        }
    }
}
