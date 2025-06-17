// API/_Controllers/AdminArtistController.cs
using LaPlazaTattoo.API.Models;
using LaPlazaTattoo.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging; // Ensure this is included

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/admin/artists")]
    [Authorize(Roles = "Admin")] // Requires authentication and Admin role
    public class AdminArtistController : ControllerBase
    {
        private readonly IArtistService _artistService;
        private readonly IFileStorageService _fileStorageService; // Inject file storage service
        private readonly ILogger<AdminArtistController> _logger;

        public AdminArtistController(IArtistService artistService, IFileStorageService fileStorageService, ILogger<AdminArtistController> logger)
        {
            _artistService = artistService;
            _fileStorageService = fileStorageService; // Assign injected service
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var artists = _artistService.GetAll();
                return Ok(artists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all artists");
                return StatusCode(500, "An error occurred while retrieving artists");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            try
            {
                var artist = _artistService.GetById(id);
                if (artist == null)
                    return NotFound($"Artist with ID {id} not found");

                return Ok(artist);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving artist with ID {ArtistId}", id);
                return StatusCode(500, "An error occurred while retrieving the artist");
            }
        }

        [HttpPost]
        // Modify to accept [FromForm] for file upload
        public async Task<IActionResult> Create(
            [FromForm] string name,
            [FromForm] string styles,
            [FromForm] string bio,
            [FromForm] string? instagramHandle, // Optional
            [FromForm] string? bookingUrl,      // Optional
            [FromForm] bool featured,           // Boolean from form
            [FromForm] IFormFile? imageFile     // File upload
        )
        {
            try
            {
                // Basic validation
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(styles) || string.IsNullOrEmpty(bio))
                {
                    return BadRequest("Name, Styles, and Bio are required.");
                }

                string imageUrl = string.Empty;
                if (imageFile != null)
                {
                    try
                    {
                        // Upload the image file
                        // Assuming UploadFileAsync takes IFormFile and a container name
                        imageUrl = await _fileStorageService.UploadFileAsync(imageFile, "artist-images");
                        _logger.LogInformation("Uploaded artist image: {ImageUrl}", imageUrl);
                    }
                    catch (Exception uploadEx)
                    {
                        _logger.LogError(uploadEx, "Error uploading artist image");
                        // Decide how to handle upload failure - return error or create artist without image?
                        // For now, returning an error:
                        return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during image upload." });
                    }
                }

                var newArtist = new Artist
                {
                    Id = Guid.NewGuid(), // Generate new ID in the backend
                    Name = name,
                    Styles = styles,
                    Bio = bio,
                    InstagramHandle = instagramHandle ?? string.Empty, // Handle optional nulls
                    BookingUrl = bookingUrl ?? string.Empty,           // Handle optional nulls
                    Featured = featured,
                    Image = imageUrl // Store the uploaded image URL
                };

                var createdArtist = _artistService.Create(newArtist); // Use the service to save

                return CreatedAtAction(nameof(GetById), new { id = createdArtist.Id }, createdArtist);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new artist");
                return StatusCode(500, "An error occurred while creating the artist");
            }
        }


        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] Artist artist)
        {
            try
            {
                if (artist == null)
                    return BadRequest("Artist data is null");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (id != artist.Id)
                    return BadRequest("ID in URL does not match ID in the request body");

                var existingArtist = _artistService.GetById(id);
                if (existingArtist == null)
                    return NotFound($"Artist with ID {id} not found");

                // TODO: Handle image update if needed. This current method expects [FromBody] Artist,
                // which doesn't support file uploads directly. A separate endpoint or a FromForm
                // update method would be needed for image updates. For now, this only updates text fields.

                var updatedArtist = _artistService.Update(artist);
                return Ok(updatedArtist);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating artist with ID {ArtistId}", id);
                return StatusCode(500, "An error occurred while updating the artist");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            try
            {
                var existingArtist = _artistService.GetById(id);
                if (existingArtist == null)
                    return NotFound($"Artist with ID {id} not found");

                // TODO: Add logic here to delete the associated image from storage

                _artistService.Delete(id);
                return NoContent(); // 204 No Content is standard for successful deletion
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting artist with ID {ArtistId}", id);
                return StatusCode(500, "An error occurred while deleting the artist");
            }
        }
    }
}
