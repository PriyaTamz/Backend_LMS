# Library Management System (Backend)

This is the backend application for the Library Management System (LMS), built with Node.js and Express. It provides RESTful API endpoints for managing users, books, reviews, and reports.

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) for user and admin authentication
- **Middleware**: Custom middleware for authentication and authorization

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PriyaTamz/Backend_LMS.git
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

### User Management
#### User Routes
- `POST /user/register`: Register a new user
- `POST /user/login`: User login
- `POST /user/logout`: User logout
- `GET /user/me`: Get logged-in user details
- `GET /user/profile`: Get user profile
- `PATCH /user/profile`: Update user profile
- `POST /user/forgot-password`: Request password reset
- `POST /user/verify-otp`: Verify OTP for password reset
- `POST /user/reset-password`: Reset user password

### Admin Management
#### Admin Routes
- `POST /admin/register`: Register a new admin
- `POST /admin/login`: Admin login
- `POST /admin/logout`: Admin logout
- `GET /admin/me`: Get logged-in admin details
- `GET /admin/profile`: Get admin profile
- `POST /admin/announcement`: Send system-wide announcements to all users
- `DELETE /admin/delete-review/:bookId/:reviewId`: Delete a specific review

### Book Management
#### Book Routes
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

### Reporting
#### Report Routes
- `GET /report/inventory`: Get inventory report
- `GET /report/borrowing-statistics`: Get borrowing statistics report
- `GET /report/user-activity`: Get user activity report

### Notification System
#### Notification
- `POST /notifications`: Create a notification (for user-specific events like borrowing or reserving)
- `GET /notifications`: Get all notifications for the logged-in user
- `DELETE /notifications/:id`: Mark a notification as read