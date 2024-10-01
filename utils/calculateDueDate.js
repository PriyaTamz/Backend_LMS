const BorrowTransaction = require('../models/borrowTransaction');

function calculateDueDate() {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate;
}

module.exports = calculateDueDate;