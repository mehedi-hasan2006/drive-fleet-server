<div align="center">

# 🚗 Drive Fleet — Server

### *The Backend API powering Drive Fleet*

A lightweight, production-ready REST API built with Express.js — handling cars, bookings, and JWT-authenticated requests for the Drive Fleet car rental platform.

[![Live API](https://img.shields.io/badge/Live%20API-drive--fleet--server--lime.vercel.app-blue?style=for-the-badge&logo=vercel)](https://drive-fleet-server-lime.vercel.app)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Related Repository](#-related-repository)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Drive Fleet Server** is the backend REST API for the [Drive Fleet](https://drive-fleet-client-tau.vercel.app) car rental platform. It handles all data operations — car listings, booking management, and user data — while enforcing JWT-based authentication on protected routes.

The server is deployed as a serverless function on Vercel and connects to a MongoDB database, making it scalable and zero-maintenance in production.

---

## ✨ Features

- **🚘 Car Management** — Full CRUD operations for car listings (create, read, update, delete)
- **📅 Booking System** — Create and manage rental bookings with availability tracking
- **🔐 JWT Authentication** — Stateless auth via `jose-cjs` for protected route verification
- **🌐 CORS Support** — Configured to accept requests from the Next.js frontend
- **⚡ Express 5** — Built on the latest Express.js with improved async error handling
- **☁️ Serverless Ready** — Deployed via Vercel with full HTTP method support (GET, POST, PUT, PATCH, DELETE)
- **🍃 MongoDB Native Driver** — Direct MongoDB integration for performant queries

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Runtime** | Node.js (CommonJS) |
| **Framework** | [Express.js v5](https://expressjs.com/) |
| **Database** | [MongoDB v7](https://www.mongodb.com/) (Native Driver) |
| **Authentication** | [jose-cjs](https://www.npmjs.com/package/jose-cjs) (JWT verification) |
| **CORS** | [cors](https://www.npmjs.com/package/cors) |
| **Config** | [dotenv](https://www.npmjs.com/package/dotenv) |
| **Deployment** | [Vercel](https://vercel.com/) (Serverless Node) |
| **Language** | JavaScript (CommonJS / ES2022) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mehedi-hasan2006/drive-fleet-server.git
   cd drive-fleet-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables)).

4. **Start the development server**

   ```bash
   node index.js
   ```

   The API will be running at `http://localhost:5000` (or your configured port).

---

## 📁 Project Structure

```
drive-fleet-server/
├── index.js          # Main application entry — Express app, DB connection, all routes
├── vercel.json       # Vercel serverless deployment configuration
├── package.json      # Project metadata and dependencies
├── .gitignore        # Files excluded from version control
└── .env              # Environment variables (not committed)
```

> This is a single-file server architecture. All routes, middleware, and database logic live in `index.js`, keeping the project simple and straightforward to navigate.

---

## 📡 API Endpoints

Base URL: `https://drive-fleet-server-lime.vercel.app`

### Cars

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/cars` | Fetch all car listings | ❌ |
| `GET` | `/cars/:id` | Fetch a single car by ID | ❌ |
| `POST` | `/cars` | Add a new car listing | ✅ |
| `PUT` | `/cars/:id` | Update a car listing | ✅ |
| `PATCH` | `/cars/:id` | Partially update a car | ✅ |
| `DELETE` | `/cars/:id` | Delete a car listing | ✅ |

### Bookings

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/bookings` | Fetch all bookings for a user | ✅ |
| `POST` | `/bookings` | Create a new booking | ✅ |
| `PATCH` | `/bookings/:id` | Update booking status | ✅ |
| `DELETE` | `/bookings/:id` | Cancel a booking | ✅ |

> **Auth Required** routes expect a valid JWT in the `Authorization: Bearer <token>` header.

---

## 🔑 Environment Variables

Create a `.env` file at the project root:

```env
# Server
PORT=5000

# MongoDB
DB_URI=your_mongodb_connection_string
DB_NAME=drive-fleet

# JWT
JWT_SECRET=your_jwt_secret_key

# CORS
CLIENT_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env` file. It is already excluded via `.gitignore`.

---

## ☁️ Deployment

This server is deployed as a **serverless function on Vercel** using the `@vercel/node` builder. The `vercel.json` config routes all HTTP methods to `index.js`:

```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## 🔗 Related Repository

This server is the backend for the **Drive Fleet** client application:

| Repo | Description | Link |
|---|---|---|
| **drive-fleet-client** | Next.js frontend | [GitHub](https://github.com/mehedi-hasan2006/drive-fleet-client) · [Live](https://drivee-fleet.vercel.app) |
| **drive-fleet-server** | Express.js backend (this repo) | [GitHub](https://github.com/mehedi-hasan2006/drive-fleet-server) · [Live](https://drive-fleet-server-lime.vercel.app) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by **[MD. Mehedi Hasan](https://github.com/mehedi-hasan2006)**

⭐ If you find this project helpful, please consider giving it a star!

</div>