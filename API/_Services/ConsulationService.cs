using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public class ConsultationService : IConsultationService
    {
        private readonly List<ConsultationRequest> _requests = new();

        public ConsultationRequest Add(ConsultationRequest request)
        {
            request.Id = _requests.Count + 1;
            _requests.Add(request);
            return request;
        }

        public IEnumerable<ConsultationRequest> GetAll() => _requests;

        public ConsultationRequest? GetById(int id) =>
            _requests.FirstOrDefault(r => r.Id == id);

            public int? PreferredArtistId { get; set; }

    }
}
