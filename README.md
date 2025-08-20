# College Event Management System

A web application for managing college events, including event creation, student registration with QR codes, and attendance tracking.

## Features

- User authentication with role-based access (admin, organizer, volunteer, participant)
- Create and manage events
- Student registration with QR code generation
- Attendance tracking using QR codes
- Role-based dashboards
- File upload for event posters
- Real-time registration count

## Tech Stack

- **Frontend**: React, Bootstrap, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **QR Code Generation**: qrcode library

## Project Structure

```
college-event-system/
├── backend/             # Node.js & Express backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
│
└── frontend/            # React frontend
    ├── public/          # Static files
    └── src/             # React source code
        ├── components/  # Reusable components
        ├── pages/       # Page components
        ├── services/    # API services
        └── context/     # React context
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-event-system
   JWT_SECRET=your_jwt_secret_key_here
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event (organizer, admin)
- `PUT /api/events/:id` - Update an event (organizer, admin)
- `DELETE /api/events/:id` - Delete an event (organizer, admin)
- `POST /api/events/:id/volunteers` - Add volunteers to an event (organizer, admin)

### Registrations
- `POST /api/registrations` - Register for an event
- `GET /api/registrations/user` - Get all registrations for current user
- `GET /api/registrations/event/:eventId` - Get all registrations for an event (organizer, volunteer, admin)
- `GET /api/registrations/count/:eventId` - Get registration count for an event

### Attendance
- `POST /api/attendance/mark` - Mark attendance using QR code (organizer, volunteer, admin)
- `GET /api/attendance/event/:eventId` - Get attendance for an event (organizer, volunteer, admin)

## Future Enhancements

- Email notifications
- Event categories and filtering
- Event feedback and ratings
- Social media sharing
- Advanced analytics dashboard
- Mobile app version

## License

This project is licensed under the MIT License.