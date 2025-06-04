using LaPlazaTattoo.API.Models;
using LaPlazaTattoo.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtistsController : ControllerBase
    {
        private readonly IArtistService _artistService;

        public ArtistsController(IArtistService artistService)
        {
            _artistService = artistService;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_artistService.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var artist = _artistService.GetById(id);
            return artist is null ? NotFound() : Ok(artist);
        }

        [HttpGet("search")]
        public IActionResult Search([FromQuery] string style)
        {
            var results = _artistService.SearchByStyle(style);
            return Ok(results);
        }
    }
}
