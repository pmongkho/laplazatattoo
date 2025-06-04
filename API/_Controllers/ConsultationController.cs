using LaPlazaTattoo.API.Models;
using LaPlazaTattoo.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultationController : ControllerBase
    {
        private readonly IConsultationService _consultationService;

        public ConsultationController(IConsultationService consultationService)
        {
            _consultationService = consultationService;
        }

        [HttpPost]
        public IActionResult Submit([FromBody] ConsultationRequest request)
        {
            var result = _consultationService.Add(request);
            return Ok(new { message = "Consultation submitted", id = result.Id });
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var all = _consultationService.GetAll();
            return Ok(all);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _consultationService.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}
