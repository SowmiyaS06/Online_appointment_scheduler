# MedBook Backend Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
The `.env` file has been created with basic configuration. You can modify it as needed:

```env
MONGODB_URI=mongodb://localhost:27017/medbook
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d
PORT=5000
```

### 3. Install and Start MongoDB

#### Option A: Using MongoDB Community Server
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

#### Option B: Using Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option C: Using MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### 4. Start the Backend Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/users/doctors` - Get all doctors
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment

## Troubleshooting

### MongoDB Connection Issues
If you see "MongoDB connection error":
1. Make sure MongoDB is running
2. Check if port 27017 is available
3. Verify the MONGODB_URI in .env file

### Port Already in Use
If port 5000 is already in use:
1. Change PORT in .env file
2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill
   ```

## Development Mode

The backend runs in development mode with:
- Hot reloading with nodemon
- Detailed error logging
- CORS enabled for frontend
- Morgan logging for HTTP requests

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in .env
2. Use a production MongoDB instance
3. Set up proper JWT secrets
4. Configure Google OAuth credentials
5. Set up email service for notifications
