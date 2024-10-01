const express = require('express');
const bookController = require('../controllers/bookController');
const adminAuth = require('../utils/adminAuth');
const userAuth = require('../utils/userAuth');

const bookRouter = express.Router();

bookRouter.get('/search', bookController.searchByUsers);
bookRouter.get('/check-borrowed/:id', userAuth.isAuthenticated, bookController.checkIfBookBorrowed);
bookRouter.post('/borrow/:id', userAuth.isAuthenticated, bookController.borrowBook);
bookRouter.get('/borrowed', userAuth.isAuthenticated, bookController.getBorrowedBooks);
bookRouter.post('/return/:id', userAuth.isAuthenticated, bookController.returnBook);
bookRouter.post('/reserve/:id', userAuth.isAuthenticated, bookController.reserveBook);

bookRouter.post('/:bookId/review', userAuth.isAuthenticated, bookController.submitReview);
bookRouter.get('/:bookId/reviews', bookController.viewReviews);

bookRouter.post('/', adminAuth.isAuthenticated, adminAuth.isAdmin, bookController.addBooks);
bookRouter.patch('/:id', adminAuth.isAuthenticated, adminAuth.isAdmin, bookController.updateBook);
bookRouter.get('/:id', adminAuth.isAuthenticated, adminAuth.isAdmin, bookController.getBooks);
bookRouter.delete('/:id', adminAuth.isAuthenticated, adminAuth.isAdmin, bookController.deleteBook);
bookRouter.get('/', bookController.viewAllBooks);
bookRouter.patch('/available/:id', adminAuth.isAuthenticated, adminAuth.isAdmin, bookController.markAsAvailable);

module.exports = bookRouter;