const app = require('./app');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');

// Use the port provided by Render or fallback to 3001 locally
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to the MongoDB database");

        // Start the Express server on the dynamically assigned port
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Error connecting to the MongoDB database", err.message);
    });
