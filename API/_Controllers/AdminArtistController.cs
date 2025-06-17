// API/_Controllers/AdminArtistController.cs
using LaPlazaTattoo.API.Models; // Make sure this using directive is present
using LaPlazaTattoo.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace LaPlazaTattoo.API.Controllers
{
    [ApiController]
    [Route("api/admin/artists")]
    [Authorize(Roles = "Admin")]
    public class AdminArtistController : ControllerBase
    {
        private readonly IArtistService _artistService;
        private readonly IFileStorageService _fileStorageService;
        private readonly ILogger<AdminArtistController> _logger;

        public AdminArtistController(IArtistService artistService, IFileStorageService fileStorageService, ILogger<AdminArtistController> logger)
        {
            _artistService = artistService;
            _fileStorageService = fileStorageService;
            _logger = logger;
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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create(
            [FromForm] string name,
            [FromForm] string styles,
            [FromForm] string bio,
            [FromForm] string? instagramHandle,
            [FromForm] string? bookingUrl,
            [FromForm] bool featured,
            [FromForm] IFormFile? imageFile
        )
        {
            try
            {
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(styles) || string.IsNullOrEmpty(bio))
                {
                    return BadRequest("Name, Styles, and Bio are required.");
                }

                string imageUrl = string.Empty;
                if (imageFile != null)
                {
                    try
                    {
                        imageUrl = await _fileStorageService.UploadFileAsync(imageFile, "artist-images");
                        _logger.LogInformation("Uploaded artist image: {ImageUrl}", imageUrl);
                    }
                    catch (Exception uploadEx)
                    {
                        _logger.LogError(uploadEx, "Error uploading artist image during creation");
                        return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during image upload." });
                    }
                }

                var newArtist = new Artist
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Styles = styles,
                    Bio = bio,
                    InstagramHandle = instagramHandle ?? string.Empty,
                    BookingUrl = bookingUrl ?? string.Empty,
                    Featured = featured,
                    Image = imageUrl
                };

                var createdArtist = _artistService.Create(newArtist);

                return CreatedAtAction(nameof(GetById), new { id = createdArtist.Id }, createdArtist);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new artist");
                return StatusCode(500, "An error occurred while creating the artist");
            }
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")] // Keep this attribute
        // Change method signature to accept the new model
        public async Task<IActionResult> Update(
            Guid id,
            [FromForm] AdminArtistUpdateModel model // Use the new model here
        )
        {
            try
            {
                // Basic validation using the model properties
                if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Styles) || string.IsNullOrEmpty(model.Bio))
                {
                    return BadRequest("Name, Styles, and Bio are required.");
                }

                var existingArtist = _artistService.GetById(id);
                if (existingArtist == null)
                    return NotFound($"Artist with ID {id} not found");

                string imageUrl = existingArtist.Image; // Start with the existing image URL

                if (model.ImageFile != null) // Check the ImageFile property from the model
                {
                    try
                    {
                        // Upload the new image file
                        string newImageUrl = await _fileStorageService.UploadFileAsync(model.ImageFile, "artist-images");
                        _logger.LogInformation("Uploaded new artist image for update: {ImageUrl}", newImageUrl);

                        // Delete the old image if it exists and is different from the new one
                        if (!string.IsNullOrEmpty(existingArtist.Image) && existingArtist.Image != newImageUrl)
                        {
                            await _fileStorageService.DeleteFileAsync(existingArtist.Image, "artist-images");
                            _logger.LogInformation("Deleted old artist image: {ImageUrl}", existingArtist.Image);
                        }

                        imageUrl = newImageUrl; // Update the image URL to the new one
                    }
                    catch (Exception uploadEx)
                    {
                        _logger.LogError(uploadEx, "Error uploading new artist image during update for ID {ArtistId}", id);
                        return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during image upload." });
                    }
                }
                // If model.ImageFile is null, the imageUrl remains the existing one.

                // Update the existing artist object with new data from the model
                existingArtist.Name = model.Name;
                existingArtist.Styles = model.Styles;
                existingArtist.Bio = model.Bio;
                existingArtist.InstagramHandle = model.InstagramHandle ?? string.Empty;
                existingArtist.BookingUrl = model.BookingUrl ?? string.Empty;
                existingArtist.Featured = model.Featured;
                existingArtist.Image = imageUrl; // Set the (potentially new) image URL

                var updatedArtist = _artistService.Update(existingArtist);

                return Ok(updatedArtist);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating artist with ID {ArtistId}", id);
                return StatusCode(500, "An error occurred while updating the artist");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var existingArtist = _artistService.GetById(id);
                if (existingArtist == null)
                    return NotFound($"Artist with ID {id} not found");

                if (!string.IsNullOrEmpty(existingArtist.Image))
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(existingArtist.Image, "artist-images");
                        _logger.LogInformation("Deleted artist image during deletion: {ImageUrl}", existingArtist.Image);
                    }
                    catch (Exception deleteEx)
                    {
                        _logger.LogError(deleteEx, "Error deleting artist image during artist deletion for ID {ArtistId}", id);
                    }
                }

                _artistService.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting artist with ID {ArtistId}", id);
                return StatusCode(500, "An error occurred while deleting the artist");
            }
        }
    }
}
