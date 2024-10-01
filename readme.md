# Library Management System (Backend)

This is the backend application for the Library Management System (LMS), built with Node.js and Express. It provides RESTful API endpoints for managing users, books, reviews, and reports.

## Features

- **User Management**
  - User registration and authentication.
  - Profile management, including password reset functionality.
  
- **Admin Management**
  - Admin registration, login, and profile management.
  - Ability to delete user reviews.

- **Book Management**
  - CRUD operations for books (Create, Read, Update, Delete).
  - Search, borrow, reserve, and return books.
  - Review management for books.

- **Notification System**
  - Users receive notifications for events such as successful borrowing, reservations, and overdue reminders.
  - Admins can send system-wide announcements to all users.

- **Reporting**
  - Generate reports for inventory, borrowing statistics, and user activity.

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) for user and admin authentication
- **Middleware**: Custom middleware for authentication and authorization

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PriyaTamz/Library-Management-System---Backend.git
   ```

2. Navigate into the project directory:
   ```bash
   cd nodejs-fsd61wde
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### User Routes
- `POST /user/register`: Register a new user
- `POST /user/login`: User login
- `POST /user/logout`: User logout
- `GET /user/me`: Get logged-in user details
- `GET /user/profile`: Get user profile
- `PATCH /user/profile`: Update user profile
- `POST /user/forgot-password`: Request password reset
- `POST /user/verify-otp`: Verify OTP for password reset
- `POST /user/reset-password`: Reset user password

### Admin Routes
- `POST /admin/register`: Register a new admin
- `POST /admin/login`: Admin login
- `POST /admin/logout`: Admin logout
- `GET /admin/me`: Get logged-in admin details
- `GET /admin/profile`: Get admin profile
- `DELETE /admin/delete-review/:bookId/:reviewId`: Delete a specific review

### Book Routes
- `GET /books`: View all books
- `GET /books/:id`: Get details of a specific book
- `POST /books`: Add a new book
- `PATCH /books/:id`: Update a book's details
- `DELETE /books/:id`: Delete a book
- `GET /books/search`: Search for books
- `POST /books/:id/borrow`: Borrow a book
- `POST /books/:id/return`: Return a borrowed book
- `POST /books/:id/reserve`: Reserve a book
- `POST /books/:bookId/review`: Submit a review for a book
- `GET /books/:bookId/reviews`: View reviews for a book

### Report Routes
- `GET /report/inventory`: Get inventory report
- `GET /report/borrowing-statistics`: Get borrowing statistics report
- `GET /report/user-activity`: Get user activity report

### Notification
- `POST /notifications`: Create a notification (for user-specific events like borrowing or reserving)
- `GET /notifications`: Get all notifications for the logged-in user
- `PATCH /notifications/:id/read`: Mark a notification as read
- `POST /admin/announcement`: Send a system-wide announcement to all users