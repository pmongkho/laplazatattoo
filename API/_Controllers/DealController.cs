using LaPlazaTattoo.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DealsController : ControllerBase
    {
        private readonly IDealService _dealService;

        public DealsController(IDealService dealService)
        {
            _dealService = dealService;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_dealService.GetActiveDeals());
    }
}
