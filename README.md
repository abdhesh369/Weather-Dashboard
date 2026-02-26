# Weather Dashboard

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to search for weather by city, use their current location to view weather data, and save favorite locations. It uses the OpenWeatherMap API to fetch current weather and a 5-day forecast, which is visualized using Recharts.

## Features

- **Current Weather & Forecasts**: View the current weather and a 5-day forecast for any city or your current location.
- **Interactive Charts**: Visualizes temperature trends using `recharts`.
- **User Authentication**: Secure user registration and login using JWT and `bcryptjs`.
- **Favorites Management**: Logged-in users can save and manage their favorite cities for quick access.
- **Responsive Design**: Built with React and optimized for desktop and mobile viewing.

## Tech Stack

### Frontend
- React 19 (via Vite)
- React Router DOM for routing
- Recharts for data visualization
- Axios for API requests
- React Icons

### Backend
- Node.js & Express.js
- MongoDB & Mongoose for the database
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- dotenv for environment variable management
- OpenWeatherMap API integration

## Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [OpenWeatherMap API Key](https://openweathermap.org/api)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Weather Dashboard"
   ```

2. **Install all dependencies:**
   The root `package.json` includes scripts to install all client and server dependencies simultaneously.
   ```bash
   npm run build
   # Or install individually: npm run install-client && npm run install-server
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   WEATHER_API_KEY=your_openweathermap_api_key
   NODE_ENV=development
   ```

## Running the Application

You can run both the client and server concurrently from the root directory:

```bash
npm run dev
```

- Complete application (concurrently): `npm run dev`
- Frontend only: `npm run client` (Runs Vite dev server on port 5173 by default)
- Backend only: `npm run server` (Runs Express server on port 5000 by default)

## API Endpoints

### Weather (Public)
- `GET /api/weather?city={cityName}` - Fetch weather by city name.
- `GET /api/weather/coords?lat={lat}&lon={lon}` - Fetch weather by coordinates.

### Authentication (Public)
- `POST /api/auth/register` - Create a new user.
- `POST /api/auth/login` - Authenticate a user and get a JWT.

### Favorites (Protected)
- `GET /api/favorites` - Get user's favorite locations.
- `POST /api/favorites` - Add a new location to favorites.
- `DELETE /api/favorites/:id` - Remove a location from favorites.

## Project Structure

```
Weather Dashboard/
├── client/                 # React frontend (Vite)
│   ├── src/
│   ├── package.json
│   └── ...
├── server/                 # Node/Express backend
│   ├── routes/             # API routes
│   ├── index.js            # Entry point
│   ├── package.json
│   └── ...
└── package.json            # Root configuration (concurrently)
```

## License

This project is licensed under the ISC License.
