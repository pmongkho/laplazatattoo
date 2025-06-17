using LaPlazaTattoo.API.Models;
using LaPlazaTattoo.API.Data;

namespace LaPlazaTattoo.API.Services
{
    public class ConsultationService : IConsultationService
    {
        private readonly AppDbContext _context;

        public ConsultationService(AppDbContext context)
        {
            _context = context;
        }

        public ConsultationRequest Add(ConsultationRequest request)
        {
            _context.ConsultationRequests.Add(request);
            _context.SaveChanges();
            return request;
        }
        public IEnumerable<ConsultationRequest> GetAll() => _context.ConsultationRequests.ToList();

        public ConsultationRequest? GetById(int id) =>
            _context.ConsultationRequests.FirstOrDefault(r => r.Id == id);

        public int? PreferredArtistId { get; set; }
    }
}