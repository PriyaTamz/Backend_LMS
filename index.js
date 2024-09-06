const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

function getCurrentDateTime() {
    const now = new Date();
    return now.toString().replace(/[:.]/g, '-');
}

app.post('/create-file', (req, res) => {
    const currentDateTime = getCurrentDateTime();
    const fileName = `files/${currentDateTime}.txt`;
    const content = `Timestamp: ${currentDateTime}`;

    fs.writeFile(fileName, content, err => {
        if (err) {
            return res.status(500).send('Error writing file');
        }
        res.send(`File created: ${fileName}`);
    });
});

app.get('/list-files', (req, res) => {
    const directoryPath = 'files';
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        res.send(txtFiles);
    });
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
