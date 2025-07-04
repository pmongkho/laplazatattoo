La Plaza Tattoo & Art Gallery
A full-stack web platform built to connect tattoo clients with skilled artists. The app includes artist profiles, AI-powered consultation forms, booking integration, and promotional listings.

🛠 Tech Stack
Frontend: Angular 20

Backend: ASP.NET Core 8.0

Database: (Assumed PostgreSQL)

Deployment: Docker, Vercel (Frontend)

Package Manager: npm

📁 Project Structure
laplazatattoo/
├── API/ # ASP.NET Core backend
├── Client/ # Angular frontend
├── Dockerfile # Containerization config
├── LaPlazaTattoo.sln # .NET solution file
├── package.json # Angular dependencies
├── vercel.json # Vercel deployment config
└── .env # Environment variables

🚀 Getting Started
Prerequisites
.NET SDK 8.0

Node.js 20+

Angular CLI

Docker (optional)

1. Clone the Repo
git clone https://your-repo-url.git
cd laplazatattoo

2. Frontend (Angular)
cd Client
npm install
ng serve

Visit http://localhost:4200

3. Backend (ASP.NET Core)
cd API
dotnet restore
dotnet run

Backend usually runs at https://localhost:5001

🐳 Docker Support
docker build -t laplazatattoo .
docker run -p 8080:8080 laplazatattoo

☁ Deployment
Frontend: Vercel

Backend: Render, Azure, or any Docker host

Add secrets to .env for API keys and DB config

🔐 Environment Variables
Example .env:

DATABASE_URL=...
JWT_SECRET=...
EMAIL_API_KEY=...

✍️ Features
Public artist profiles with Instagram feeds

Smart consultation form with image uploads

Admin/artist notifications

External booking links (GlossGenius, Square, etc.)

📄 License
MIT — build and expand it as you see fit.

Built with ❤️ for tattoo artists by tattoo artists.