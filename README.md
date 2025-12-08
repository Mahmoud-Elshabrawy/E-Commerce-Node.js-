# E-Commerce-Node.js

A complete **E-Commerce REST API** built with **Node.js**, **Express**, and **MongoDB**, featuring authentication, product management, cart, orders, and full Swagger documentation.

---

## 🚀 Features

- User registration & authentication (JWT)
- Product CRUD (Create, Read, Update, Delete)
- Categories & product filtering/search
- Cart management
- Order creation & order status tracking
- Input validation & centralized error handling
- Security middlewares (Rate limiting, CORS, Helmet, Mongo sanitize…)
- Full Swagger API documentation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JSON Web Tokens (JWT) |
| **Documentation** | Swagger (OpenAPI) |
| **Dev Tools** | Nodemon, Dotenv, Morgan |

---

## 🌐 Live Demo / Servers

| Environment | URL |
|-------------|-----|
| **Production** | https://e-shop-0c.up.railway.app |

> ⚠️ If Swagger does not load, verify that you used the correct base path  
> Example: `/api/v1` (avoid mistakes like `/aip/v1`)

---

## 📦 Prerequisites

Make sure you have installed:

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (Local or Atlas)

---

## 📥 Installation

# Clone repo
git clone https://github.com/Mahmoud-Elshabrawy/E-Commerce-Node.js-.git


# Install dependencies
npm install


## 📂 Project Structure
```bash

E-Commerce-Node.js-/
├── config/               # Config files (DB connection, environment, etc.)
├── controllers/          # Route controllers (business logic)
├── middlewares/          # Auth, error handling, validators, security
├── models/               # Mongoose models (User, Product, Order...)
├── routes/               # API route definitions
├── swagger/              # Swagger configuration files
├── uploads/              # Uploaded product/user images
├── utils/                # Helper functions
├── node_modules/
├── .gitignore
├── config.env            # Environment variables
└── server.js             # App entry point
