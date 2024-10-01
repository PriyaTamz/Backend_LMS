const app = require('./app');

const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to the MongoDB database");

        app.listen(3001, () => {
            console.log("Server is running on http://localhost:3001");
        });
    })
    .catch((err) => {
        console.log("Error connecting to the MongoDB database", err);
    });