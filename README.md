# MedScheduler - Complete Medical Appointment Management System

A full-stack medical appointment scheduling system built with React, Node.js, Express, and MongoDB. Features include user authentication, appointment management, admin dashboard with analytics, and real-time notifications.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with Google OAuth2 integration
- **Role-based Access Control**: Patient, Doctor, and Admin roles with different permissions
- **Appointment Management**: Create, view, update, and cancel appointments
- **Calendar View**: Interactive calendar for appointment scheduling
- **Admin Dashboard**: Comprehensive analytics and reporting
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface

### Advanced Features
- **Email Notifications**: Automated appointment reminders and confirmations
- **Audit Logging**: Track all user actions for security and compliance
- **Real-time Analytics**: Charts and graphs for appointment trends
- **Data Export**: Export appointments, users, and audit logs
- **Search & Filtering**: Advanced search and filter capabilities
- **Payment Integration**: Built-in payment tracking system

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Big Calendar** - Calendar component
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
- **Nodemailer** - Email service
- **Morgan** - HTTP request logger
- **Bcryptjs** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MedScheduler
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/medscheduler

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections when you start the backend server.

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

### Email Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASS` field

## 📱 Usage

### For Patients
1. Register/Login to your account
2. Browse available doctors
3. Book appointments with preferred doctors
4. View and manage your appointments
5. Cancel appointments if needed

### For Doctors
1. Register with doctor role
2. Set your availability and consultation fees
3. View your appointment schedule
4. Update appointment status
5. Add notes and prescriptions

### For Admins
1. Access the admin dashboard
2. View comprehensive analytics
3. Manage users and appointments
4. Export data for reporting
5. Monitor system activity through audit logs

## 🗂️ Project Structure

```
MedScheduler/
├── backend/
│   ├── config/
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── userController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── appointments.js
│   │   └── reports.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentCalendar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── ...
│   │   └── ...
│   └── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Audit logging for all actions
- Rate limiting (can be added)

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster or use a cloud MongoDB service
2. Deploy to platforms like Heroku, Railway, or AWS
3. Update environment variables for production
4. Configure CORS for your frontend domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update API endpoints to point to your backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- Video consultation integration
- Mobile app development
- Advanced payment processing
- SMS notifications
- Multi-language support
- Advanced reporting features
- Integration with medical records systems

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, testing, and compliance with healthcare regulations.
