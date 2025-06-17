// API/Models/AdminArtistUpdateModel.cs
using Microsoft.AspNetCore.Http;
using System;

namespace LaPlazaTattoo.API.Models
{
    public class AdminArtistUpdateModel
    {
        // Note: The ID is typically passed in the route, not the form body for PUT
        // public Guid Id { get; set; } // Remove this if ID is only in the route

        public string Name { get; set; } = string.Empty;
        public string Styles { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string? InstagramHandle { get; set; }
        public string? BookingUrl { get; set; }
        public bool Featured { get; set; }
        public IFormFile? ImageFile { get; set; } // Optional file upload
    }
}
