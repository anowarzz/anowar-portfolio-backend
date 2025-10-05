# Md. Anowar Hosen - Portfolio Backend

## Live Deployment

- [Live API on Vercel](https://anowarzz-portfolio-server.vercel.app/api)

## Project Overview

This is the backend for the Md. Anowar Hosen - Portfolio project. It powers the portfolio website with a secure and scalable RESTful API, handling everything from user management to blog and project content. The backend is built to be robust, easy to maintain, and simple to connect with the frontend client.

## Features

- **User Authentication & Authorization:**

  - Secure login and registration using JWT tokens.
  - Role-based access control for users and admins.

- **Admin Management:**

  - Super admin credentials are set up for initial access.
  - Admins can manage users, projects, and blog posts.

- **Project & Blog Management:**

  - Full CRUD (Create, Read, Update, Delete) operations for both projects and blog posts.
  - Each project and blog post can include rich content and media.

- **Media Uploads:**

  - Integrated with Cloudinary for efficient and reliable image uploads and storage.

- **Environment-based Configuration:**

  - Easily switch between development and production environments using environment variables.

- **Error Handling & Validation:**
  - Consistent error responses and input validation for all endpoints.
  - Helpful error messages for easier debugging and integration.

## Technology Stack

- Node.js (TypeScript)
- Express.js
- Prisma ORM (PostgreSQL)
- Supabase (PostgreSQL hosting)
- Cloudinary (media storage)
- Vercel (deployment)

## Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone https://github.com/anowarzz/anowar-portfolio-backend.git
   cd anowar-portfolio-backend
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values (see `.env` for reference).

4. **Run database migrations:**

   ```sh
   pnpm prisma migrate deploy
   # or
   npx prisma migrate deploy
   ```

5. **Start the development server:**

   ```sh
   pnpm run dev
   # or
   npm run dev
   ```

6. **Build and deploy:**
   ```sh
   pnpm run build && vercel && vercel --prod
   ```

## Notes

- The backend is ready for production and uses environment variables for sensitive configuration (database, JWT, Cloudinary, etc).
- Default admin credentials are provided in the `.env` file for initial setup.
- The API is designed to work seamlessly with the frontend client at [https://anowarzz-here.vercel.app](https://anowarzz-here.vercel.app).

---

© 2025 Anowar. All rights reserved.
