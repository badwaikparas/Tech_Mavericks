# HX2508 Room Booking Assistant - Campus Automation

## Overview

The **HX2508 Room Booking Assistant** is a web application designed to streamline the process of reserving classrooms and labs in real-time. The system helps prevent scheduling conflicts and ensures efficient space utilization within a campus setting.

## Features

- **Real-time Room Reservation**: Users can book classrooms and labs instantly.
- **Conflict Detection**: Prevents double booking by checking for scheduling conflicts.
- **User Authentication**: Secure login system for faculty, students, and administrators.
- **Role-Based Access Control**: Different permissions for users (e.g., admin, faculty, student).
- **Booking Calendar View**: Visual representation of booked and available slots.
- **Search & Filter**: Find rooms based on capacity, availability, and amenities.
- **Email Notifications**: Automated alerts for successful bookings and cancellations.
- **Admin Panel**: Manage bookings, approve/reject requests, and configure room details.

## Tech Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: Docker, AWS/GCP/Azure

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/hx2508-room-booking.git
   cd hx2508-room-booking
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Sign up or log in to the system.
2. Search for available rooms based on date, time, and other criteria.
3. Select a room and confirm the booking.
4. View, edit, or cancel your reservations in the dashboard.

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added a new feature"
   ```
4. Push to the branch and create a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any queries or suggestions, please contact **your-email@example.com**.
