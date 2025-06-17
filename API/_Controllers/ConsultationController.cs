using LaPlazaTattoo.API.Models;
using LaPlazaTattoo.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultationController : ControllerBase
    {
        private readonly IConsultationService _consultationService;
        private readonly IFileStorageService _fileStorageService;

        public ConsultationController(IConsultationService consultationService, IFileStorageService fileStorageService)
        {
            _consultationService = consultationService;
            _fileStorageService = fileStorageService;
        }

        [HttpPost]
        public async Task<IActionResult> Submit(
            [FromForm] string clientName,
            [FromForm] string email,
            [FromForm] string? preferredArtist,
            [FromForm] string style,
            [FromForm] string placement,
            [FromForm] string size,
            [FromForm] string? description,
            [FromForm] List<IFormFile>? referenceImages
          )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(clientName) || string.IsNullOrEmpty(email) ||
                string.IsNullOrEmpty(style) || string.IsNullOrEmpty(placement) ||
                string.IsNullOrEmpty(size))
            {
                return BadRequest("Required fields are missing.");
            }

            var imageUrls = new List<string>();
            if (referenceImages != null && referenceImages.Count > 0)
            {
                try
                {
                    imageUrls = await _fileStorageService.UploadFilesAsync(referenceImages, "consultation-images");
                    Console.WriteLine($"Successfully uploaded {imageUrls.Count} images.");
                }
                catch (Exception uploadEx)
                {
                    Console.WriteLine($"Error during file upload: {uploadEx.ToString()}");
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during file upload." });
                }
            }

            var request = new ConsultationRequest
            {
                ClientName = clientName,
                Email = email,
                PreferredArtist = preferredArtist,
                Style = style,
                Placement = placement,
                Size = size,
                Description = description,
                ReferenceImages = imageUrls,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                var result = _consultationService.Add(request);

                return Ok(new
                {
                    message = "Consultation submitted successfully",
                    id = result.Id,
                    referenceImageUrls = result.ReferenceImages
                });
            }
            catch (Exception dbEx)
            {
                Console.WriteLine($"Error saving consultation to database: {dbEx.ToString()}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while saving the consultation request to the database." });
            }
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

        [HttpPost("{id}/archive")]
        public IActionResult Archive(int id)
        {
            Console.WriteLine($"Received request to archive consultation with ID: {id}");
            return Ok(new { message = $"Consultation {id} marked for archiving (backend placeholder)." });
        }
    }
}