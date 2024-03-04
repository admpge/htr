const express = require('express');
const multer = require('multer');
const cors = require('cors');
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadedFilePath = req.file.path;
    console.log(`Received file for processing: ${uploadedFilePath}`);

    const scriptPath = path.join(__dirname, 'htr/scripts/demo.py');

    try {
        const result = await htrScript(scriptPath, uploadedFilePath);
        res.json({ text: result.trim() });

        // File cleanup
        fs.unlink(uploadedFilePath, err => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log(`Deleted uploaded file: ${uploadedFilePath}`);
            }
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).send('Error processing the image.');
    }
});

async function htrScript(scriptPath, filePath) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [scriptPath, filePath]);
        let result = '';

        pythonProcess.stdout.on('data', data => (result += data.toString()));
        pythonProcess.stderr.on('data', data => reject(new Error(data.toString())));

        pythonProcess.on('close', code => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });
    });
}
