using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace LaPlazaTattoo.API.Services
{
    public class AzureBlobStorageService : IFileStorageService
    {
        private readonly string _connectionString;
        private readonly BlobServiceClient _blobServiceClient;
        public AzureBlobStorageService(IConfiguration configuration)
        {
            _connectionString = configuration["AzureStorage:ConnectionString"]
                                ?? throw new InvalidOperationException("Azure Storage ConnectionString is not configured.");

            _blobServiceClient = new BlobServiceClient(_connectionString);
        }

        public async Task<List<string>> UploadFilesAsync(IEnumerable<IFormFile> files, string containerName)
        {
            var uploadedUrls = new List<string>();

            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            await containerClient.CreateIfNotExistsAsync();
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var blobName = $"{Guid.NewGuid().ToString()}{Path.GetExtension(file.FileName)}";
                    BlobClient blobClient = containerClient.GetBlobClient(blobName);

                    using (var stream = file.OpenReadStream())
                    {
                        await blobClient.UploadAsync(stream, true);
                    }

                    uploadedUrls.Add(blobClient.Uri.ToString());
                }
            }

            return uploadedUrls;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string containerName)
        {
            if (file.Length > 0)
            {
                var blobName = $"{Guid.NewGuid().ToString()}{Path.GetExtension(file.FileName)}";
                BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                await containerClient.CreateIfNotExistsAsync();
                BlobClient blobClient = containerClient.GetBlobClient(blobName);

                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, true);
                }

                return blobClient.Uri.ToString();
            }

            throw new InvalidOperationException("File is empty.");
        }
    }
}