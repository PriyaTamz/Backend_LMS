const Book = require('../models/book');
const BorrowTransaction = require('../models/borrowTransaction');
const calculateDueDate = require('../utils/calculateDueDate');
const Notification = require('../models/Notification');
const User = require('../models/user');

const bookController = {
    addBooks: async (req, res) => {
        const { title, author, ISBN, genre, publication_year } = req.body;

        if (!ISBN) {
            return res.status(400).json({ message: 'ISBN is required' });
        }

        try {
            const book = new Book({
                title,
                author,
                ISBN, 
                genre,
                publication_year
            });

            await book.save();
            res.status(201).json({ message: 'Book added successfully', book });
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).json({ message: 'Duplicate ISBN', error: error.message });
            } else {
                res.status(500).json({ message: 'Error adding book', error: error.message });
            }
        }
    },
    /*addBooks: async (req, res) => {
        try {
            const books = req.body;
            const savedBook = await Book.create(books);
            return res.status(201).json({ message: "Book(s) Created Successfully", savedBook });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Duplicate ISBN found. Please use a unique ISBN for each book." });
            }
            return res.status(500).json({ message: error.message });
        }
    },*/
    updateBook: async (req, res) => {
        try {
            const { id } = req.params;
            const updateBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
            if (!updateBook) {
                return res.status(404).json({ message: "Book not found" });
            }
            return res.status(200).json({ message: "Book Updated Successfully", updateBook });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getBooks: async (req, res) => {
        try {
            const { id } = req.params;
            const books = await Book.findById(id);
            if (!books) {
                return res.status(404).json({ message: "Book not Found" });
            }
            res.status(200).json(books);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    viewBookDetails: async (req, res) => {
        try {
            const { id } = req.params; 

            const book = await Book.findById(id).populate('reviews.userId', 'name email'); 
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    viewBookDetailsAuthenticated: async (req, res) => {
        try {
            const { id } = req.params; 

            const book = await Book.findById(id).populate('reviews.userId', 'name email'); 

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteBook: async (req, res) => {
        try {
            const { id } = req.params;
            const deleteBook = await Book.findByIdAndDelete(id);
            if (!deleteBook) {
                return res.status(404).json({ message: "Book not Found" });
            }
            return res.status(200).json({ message: "Book Deleted Successfully", deleteBook });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    viewAllBooks: async (req, res) => {
        try {
            const books = await Book.find().populate('borrowedBy', 'name');
            if (!books || books.length === 0) {
                return res.status(404).json({ message: "No books found" });
            }
            res.status(200).json(books);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    reserveBook: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const book = await Book.findById(id);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }


            if (book.isAvailable) {
                return res.status(400).json({ message: "Book is available and doesn't need reservation" });
            }


            if (!book.reservedBy.includes(userId)) {
                book.reservedBy.push(userId);
                book.reserved = true;
                book.reservedDate = new Date();
                await book.save();


                const notification = new Notification({
                    userId,
                    message: `You have successfully reserved the book "${book.title}".`
                });
                await notification.save();

                return res.status(200).json({ message: "Book reserved successfully", book });
            } else {
                return res.status(400).json({ message: "User already reserved this book" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    markAsAvailable: async (req, res) => {
        try {
            const { id } = req.params;
            const { isAvailable } = req.body;

            const book = await Book.findById(id);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }


            book.isAvailable = isAvailable;
            book.reserved = false;


            if (book.reservedBy.length > 0) {
                const nextUser = book.reservedBy.shift();

                await book.save();
                return res.status(200).json({ message: `Book is now available and reserved for the next user`, book });
            } else {
                await book.save();
                return res.status(200).json({ message: "Book is now available", book, isAvailable });
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    searchByUsers: async (req, res) => {
        try {
            const { title, author, genre, ISBN, all } = req.query;


            let searchCriteria = {};


            if (all) {
                const regexSearch = { $regex: all, $options: 'i' };
                searchCriteria = {
                    $or: [
                        { title: regexSearch },
                        { author: regexSearch },
                        { genre: regexSearch },
                        { ISBN: regexSearch }
                    ]
                };
            } else {

                if (title) {
                    searchCriteria.title = { $regex: title, $options: 'i' };
                }
                if (author) {
                    searchCriteria.author = { $regex: author, $options: 'i' };
                }
                if (genre) {
                    searchCriteria.genre = genre;
                }
                if (ISBN) {
                    searchCriteria.ISBN = ISBN;
                }
            }


            const books = await Book.find(searchCriteria);
            if (books.length === 0) {
                return res.status(404).json({ message: "No books found matching the search criteria" });
            }

            res.status(200).json({ books });
        } catch (error) {
            console.error('Error fetching books:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    borrowBook: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const book = await Book.findById(id).populate('borrowedBy', 'name');
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }


            if (!book.isAvailable && (!book.reservedBy || !book.reservedBy.includes(userId))) {
                return res.status(400).json({ message: "Book is not available or reserved by another user" });
            }

            const userBorrowsBooks = await BorrowTransaction.countDocuments({ userId, returnDate: null });
            console.log('books borrow count:', userBorrowsBooks);

            const borrowingLimit = 5;
            if (userBorrowsBooks >= borrowingLimit) {
                return res.status(403).json({ message: "Book limit reached" });
            }


            const transaction = new BorrowTransaction({
                userId,
                bookId: book._id,
                borrowDate: new Date(),
                dueDate: calculateDueDate()
            });

            await transaction.save();

            book.isAvailable = false;
            book.borrowedBy = userId;


            if (book.reservedBy && book.reservedBy.includes(userId)) {
                book.reservedBy = book.reservedBy.filter(id => id.toString() !== userId);
            }

            await book.save();

            await User.findByIdAndUpdate(userId, {
                $push: { borrowedBooks: transaction._id }
            });

            await Notification.create({
                userId: req.user._id,
                message: `You have successfully borrowed the book: ${book.title}. Due date: ${transaction.dueDate.toDateString()}.`
            });

            res.status(200).json({ message: "Book borrowed successfully", transaction });
        } catch (error) {
            console.error("Borrow book error:", error);
            res.status(500).json({ message: error.message });
        }
    },
    getBorrowedBooks: async (req, res) => {
        try {
            const userId = req.user.id;


            const transactions = await BorrowTransaction.find({ userId })
                .populate('bookId', 'title');

            if (!transactions || transactions.length === 0) {
                return res.status(404).json({ message: "No borrowed books found" });
            }

            res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching borrowed books:", error);
            res.status(500).json({ message: error.message });
        }
    },

    checkIfBookBorrowed: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;


            const transaction = await BorrowTransaction.findOne({ userId, bookId: id, returnDate: null });

            if (transaction) {

                return res.status(200).json({ borrowed: true });
            } else {

                return res.status(200).json({ borrowed: false });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    returnBook: async (req, res) => {
        try {
            const { id: bookId } = req.params;
            const userId = req.user.id;


            const transaction = await BorrowTransaction.findOne({ bookId, userId, returnDate: null });
            if (!transaction) {
                return res.status(400).json({ message: "Transaction not found" });
            }


            transaction.returnDate = new Date();
            console.log("Returning book. Setting returnDate:", transaction.returnDate);


            const dueDate = transaction.dueDate;
            const today = new Date();
            if (today > dueDate) {
                const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                transaction.lateFee = daysLate;
            }

            await transaction.save();


            const book = await Book.findById(bookId);

            // Update user's borrowedBooks
            const user = await User.findById(userId);
            user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== bookId);
            await user.save();

            if (book.reservedBy.length > 0) {
                
                const nextUserId = book.reservedBy.shift();
                //book.borrowedBy = nextUserId;
                book.isAvailable = true; // Mark the book available for reservation
                book.reserved = false;


                /*const newTransaction = new BorrowTransaction({
                    userId: nextUserId,
                    bookId: book._id,
                    borrowDate: new Date(),
                    dueDate: calculateDueDate()
                });

                await newTransaction.save();*/

                
                const notification = new Notification({
                    userId: nextUserId,
                    message: `The book "${book.title}" is now available. Would you like to borrow it?`,
                    type: 'borrow-confirmation',
                    createdAt: new Date(),
                    bookId: book._id 
                });
                await notification.save();

            } else {

                book.isAvailable = true;
                book.borrowedBy = null;
                book.reserved = false;
                book.reservedBy = [];
            }

            await book.save();

            res.status(200).json({ message: "Book returned successfully", book, transaction });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    confirmBorrowBook: async (req, res) => {
        try {
            const { bookId } = req.params;
            const userId = req.user.id;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            if (!book.isAvailable) {
                return res.status(400).json({ message: "Book is no longer available for borrowing" });
            }

            // Create a new borrow transaction
            const transaction = new BorrowTransaction({
                userId,
                bookId: book._id,
                borrowDate: new Date(),
                dueDate: calculateDueDate()
            });

            await transaction.save();

            book.isAvailable = false;
            book.borrowedBy = userId;
            await book.save();

           
            await Notification.create({
                userId,
                message: `You have successfully borrowed the book: "${book.title}". Due date: ${transaction.dueDate.toDateString()}.`,
            });

            res.status(200).json({ message: "Book borrowed successfully", transaction });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    submitReview: async (req, res) => {
        try {
            const userId = req.userId;
            const { rating, review } = req.body;
            const { bookId } = req.params;


            const borrowTransaction = await BorrowTransaction.findOne({
                userId,
                bookId,
                returnDate: { $ne: null }
            });

            if (!borrowTransaction) {
                return res.status(400).json({ message: "You can only review books you've borrowed and returned." });
            }


            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found." });
            }


            book.reviews.push({ userId, rating, review });
            await book.save();


            res.status(201).json({ message: 'Review submitted successfully' });
        } catch (error) {

            res.status(500).json({ message: error.message });
        }
    },
    viewReviews: async (req, res) => {
        try {
            const { bookId } = req.params;
            const book = await Book.findById(bookId).populate('reviews.userId');
            console.log(book.reviews);

            res.status(200).json(book.reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = bookController;