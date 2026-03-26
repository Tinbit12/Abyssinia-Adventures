# Abyssinia Adventures - Full-Stack Application

A full-stack travel agency website built with **React** (frontend), **Node.js/Express** (backend), and **MongoDB** (database). This project demonstrates a complete MERN stack application for a travel agency promoting tourism in Ethiopia.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend-Backend Communication](#frontend-backend-communication)
- [Database Schema](#database-schema)
- [Features](#features)
- [Academic Notes](#academic-notes)

## 🎯 Project Overview

Abyssinia Adventures is a travel agency website that promotes tourism experiences across Ethiopia. The application allows users to:

- Browse travel destinations
- View tour packages
- Search and filter destinations and packages
- Submit contact inquiries
- Learn about the travel agency

The project follows academic best practices with clean, readable code suitable for learning full-stack development.

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **CSS3** - Styling (no frameworks)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Abyssinia-Adventures/
│
├── frontend/                 # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Destinations.jsx
│   │   │   ├── Packages.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Booking.jsx
│   │   │   └── Admin.jsx
│   │   ├── App.jsx         # Main app component with routing
│   │   ├── App.css
│   │   ├── index.js        # Entry point
│   │   ├── index.css
│   │   └── api.js          # API communication functions
│   └── package.json
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── data/
│   │   │   └── seedData.js  # Shared seed data (destinations, packages, test users)
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT auth and admin middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Destination.js
│   │   │   ├── Package.js
│   │   │   ├── Booking.js
│   │   │   └── ContactMessage.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── destinations.js
│   │   │   ├── packages.js
│   │   │   ├── bookings.js
│   │   │   ├── users.js
│   │   │   └── contact.js
│   │   ├── scripts/
│   │   │   ├── seed.js           # Manual seed (npm run seed)
│   │   │   ├── runSeedIfNeeded.js # Auto-seed on first run
│   │   │   └── sanityCheck.js    # Sanity check (npm run sanity)
│   │   ├── utils/
│   │   │   └── dateUtils.js     # Date normalization for bookings
│   │   ├── db.js            # MongoDB connection
│   │   └── app.js           # Express server
│   ├── .env                 # Environment variables (copy from .env.example)
│   └── package.json
│
└── README.md
```

## 📦 Prerequisites

- **Node.js** v18 or higher (for `fetch` in sanity script) – [Download](https://nodejs.org/)
- **MongoDB** – local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **npm** (included with Node.js)

## 🚀 Quick Start (fresh clone)

From a clean clone, no manual DB setup beyond MongoDB running and `.env`:

```bash
# Terminal 1 – backend (ensure MongoDB is running and .env exists in backend/)
cd backend
cp .env.example .env   # edit .env: set MONGO_URI or MONGODB_URI, JWT_SECRET
npm install
npm run dev            # auto-seeds on first run if DB is empty

# Terminal 2 – frontend
cd frontend
npm install
npm start
```

Then open http://localhost:3000, log in with **user@test.com** / **TestUser123!**, and create a booking at **Book**.

---

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to the Project

```bash
cd Abyssinia-Adventures
```

### Step 2: Set Up the Backend

1. Go to the backend and install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set at least:
# MONGO_URI or MONGODB_URI (required)
# JWT_SECRET (required for auth)
# PORT (optional, default 5000)
```

Required variables:
- **MONGO_URI** or **MONGODB_URI** – MongoDB connection string (e.g. `mongodb://localhost:27017/abyssinia-adventures`)
- **JWT_SECRET** – Secret for JWT tokens (use a long random string in production)

3. Ensure MongoDB is running (local) or your Atlas URI is correct.

### Step 3: Set Up the Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the `frontend` directory if you need to change the API URL:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## ▶️ Running the Application

After a **fresh clone**, you only need to install dependencies and set `.env`; the backend **seeds the database automatically on first run** (when no destinations exist). No manual seed step is required.

### Start the Backend

```bash
cd backend
npm run dev
```

- Server runs at **http://localhost:5000**
- On first start, if the database is empty, destinations, packages, and **test users** are inserted automatically.
- You can also run `npm run seed` manually to reset and repopulate destinations/packages (clears existing destinations and packages).

### Start the Frontend

In a **new terminal**:

```bash
cd frontend
npm start
```

- App runs at **http://localhost:3000**

### Test Users (after first run or seed)

| Email           | Password    | Role  |
|----------------|-------------|-------|
| user@test.com  | TestUser123! | user  |
| admin@test.com | Admin123!   | admin |

Use these to log in and test bookings; admin can access the Admin dashboard.

### Verify Setup (sanity check)

With the backend running:

```bash
cd backend
npm run sanity
```

This checks health, destinations, packages, login, and a full booking create/delete flow.

### Quick Reference

- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:5000  
- **Health**: http://localhost:5000/api/health

## 🔌 API Endpoints

The backend provides the following REST API endpoints:

### Destinations

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get a single destination by ID

**Example Response:**
```json
[
  {
    "_id": "...",
    "name": "Lalibela",
    "description": "Explore the famous rock-hewn churches...",
    "image": "https://...",
    "location": "Amhara Region",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### Packages

- `GET /api/packages` - Get all tour packages
- `GET /api/packages/:id` - Get a single package by ID

**Example Response:**
```json
[
  {
    "_id": "...",
    "title": "Historic North Circuit",
    "duration": "10 Days",
    "price": 2500,
    "description": "A comprehensive tour...",
    "image": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### Contact

- `POST /api/contact` - Submit a contact form message

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in your tours..."
}
```

**Response:**
```json
{
  "message": "Contact form submitted successfully",
  "contact": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "...",
    "createdAt": "..."
  }
}
```

## 🔄 Frontend-Backend Communication

### How It Works

1. **API Configuration** (`frontend/src/api.js`):
   - Centralized file for all API calls
   - Uses `fetch` API to communicate with the backend
   - Base URL: `http://localhost:5000/api` (configurable via environment variable)

2. **Data Flow**:
   ```
   React Component → api.js → Backend API → MongoDB → Response → React Component
   ```

3. **Example Usage in Components**:
   ```javascript
   import { fetchDestinations } from '../api';
   
   useEffect(() => {
     const loadData = async () => {
       const destinations = await fetchDestinations();
       setDestinations(destinations);
     };
     loadData();
   }, []);
   ```

4. **CORS Configuration**:
   - Backend uses `cors` middleware to allow requests from the React frontend
   - This enables cross-origin requests between `localhost:3000` (frontend) and `localhost:5000` (backend)

## 🗄️ Database Schema

### User

| Field    | Type   | Required | Notes                          |
|----------|--------|----------|--------------------------------|
| name     | String | yes      | trim                           |
| email    | String | yes      | unique, lowercase              |
| password | String | yes      | hashed, min 8, select: false   |
| role     | String | yes      | enum: 'user', 'admin', default 'user' |
| createdAt, updatedAt | Date | auto     |                                |

### Destination

| Field       | Type   | Required | Notes                          |
|-------------|--------|----------|--------------------------------|
| name        | String | yes      | trim                           |
| description | String | yes      |                                |
| image       | String | yes      |                                |
| location    | String | yes      |                                |
| maxCapacity | Number | no       | max guests per day; null = unlimited |
| createdAt, updatedAt | Date | auto     |                                |

### Package

| Field       | Type   | Required | Notes                          |
|-------------|--------|----------|--------------------------------|
| title       | String | yes      | trim                           |
| duration    | String | yes      |                                |
| price       | Number | yes      | min 0                          |
| description | String | yes      |                                |
| image       | String | yes      |                                |
| maxCapacity | Number | no       | max guests per day; null = unlimited |
| createdAt, updatedAt | Date | auto     |                                |

### Booking

| Field          | Type     | Required | Notes                                  |
|----------------|----------|---------|----------------------------------------|
| user           | ObjectId | yes     | ref: User                              |
| itemType       | String   | yes     | enum: 'destination', 'package'         |
| itemId         | ObjectId | yes     | destination or package _id            |
| date           | Date     | yes     | normalized to start of day (UTC)       |
| numberOfPeople | Number   | yes     | min 1                                  |
| note           | String   | no      | default ''                             |
| status         | String   | yes     | enum: pending, approved, cancelled; default pending |
| createdAt, updatedAt | Date | auto     |                                        |

- **Duplicate prevention**: One active (pending/approved) booking per user per item per date.
- **Capacity**: If destination/package has `maxCapacity`, total `numberOfPeople` for that item on that date (pending + approved) cannot exceed it.
- **Past dates**: Booking date cannot be in the past.

### ContactMessage

| Field       | Type   | Required | Notes        |
|-------------|--------|----------|-------------|
| name        | String | yes      |             |
| email       | String | yes      |             |
| message     | String | yes      |             |
| extraFields | Mixed  | no       | default {}  |
| ip, userAgent | String | no     |             |
| createdAt, updatedAt | Date | auto |             |

## ✨ Features

### Frontend Features

- ✅ **Single Page Application (SPA)** with React Router
- ✅ **Dynamic Data Loading** from backend API
- ✅ **Search/Filter Functionality** for destinations and packages
- ✅ **Form Validation** on contact form
- ✅ **Loading States** while fetching data
- ✅ **Error Handling** with user-friendly messages
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Reusable Components** (Card, Header, Footer, etc.)

### Backend Features

- ✅ **RESTful API** with Express
- ✅ **MongoDB Integration** with Mongoose
- ✅ **CORS Enabled** for frontend communication
- ✅ **Input Validation** on API endpoints
- ✅ **Error Handling** with appropriate HTTP status codes
- ✅ **Environment Variables** for configuration

## 📚 Academic Notes

### Design Decisions

1. **Functional Components Only**: All React components use functional components with hooks (useState, useEffect) for simplicity and modern React practices.

2. **Separation of Concerns**:
   - Frontend handles UI and user interactions
   - Backend handles data processing and database operations
   - API layer (`api.js`) separates HTTP logic from components

3. **Reusable Components**: The `Card` component is used for both destinations and packages, demonstrating component reusability.

4. **Simple State Management**: Uses React's built-in state management (useState) rather than external libraries like Redux, keeping the project simple and educational.

5. **Plain CSS**: No CSS frameworks used to keep styling transparent and easy to understand.

### Learning Points

- **MERN Stack**: Full-stack development with MongoDB, Express, React, and Node.js
- **RESTful API Design**: Proper HTTP methods and status codes
- **Database Modeling**: Mongoose schemas and models
- **React Hooks**: useState and useEffect for state and side effects
- **React Router**: Client-side routing in a SPA
- **Async/Await**: Handling asynchronous operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation before submission

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running (local) or your Atlas connection string is correct
- Check your `.env` file has the correct `MONGODB_URI`

**Port Already in Use:**
- Change the `PORT` in `.env` to a different port (e.g., 5001)
- Update frontend `api.js` to use the new port

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure the backend server is running
- Check that the API URL in `api.js` matches your backend port
- Verify CORS is enabled in the backend

**Blank Page:**
- Check browser console for errors
- Ensure all dependencies are installed (`npm install`)
- Clear browser cache and restart the dev server

## 📝 License

This project is created for educational purposes.

## 👨‍🏫 For Instructors

This project is designed to be:
- **Easy to understand** for students learning full-stack development
- **Well-commented** with explanations of key concepts
- **Modular** with clear separation between frontend and backend
- **Extensible** for students to add features

---

**Happy Coding! 🚀**
