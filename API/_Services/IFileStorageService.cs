using Microsoft.AspNetCore.Http; // For IFormFile
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LaPlazaTattoo.API.Services
{
    public interface IFileStorageService
    {
        Task<List<string>> UploadFilesAsync(IEnumerable<IFormFile> files, string containerName);
        Task<string> UploadFileAsync(IFormFile file, string containerName);
        // Add methods for deleting files, getting file info, etc. if needed
        // Task DeleteFileAsync(string fileName, string containerName);
    }
}
