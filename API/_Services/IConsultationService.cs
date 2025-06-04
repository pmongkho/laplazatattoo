using LaPlazaTattoo.API.Models;

namespace LaPlazaTattoo.API.Services
{
    public interface IConsultationService
    {
        ConsultationRequest Add(ConsultationRequest request);
        IEnumerable<ConsultationRequest> GetAll();
        ConsultationRequest? GetById(int id);
    }
}
