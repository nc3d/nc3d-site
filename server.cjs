require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const Airtable = require('airtable');
const path = require('path');
const multer = require('multer'); // Import multer

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Multer (Handle file uploads in memory)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB
});

// Serve Static Files
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/projects', express.static(path.join(__dirname, 'projects')));

// Configuration
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// --- API ROUTE (Note: 'upload.single' middleware) ---
app.post('/submit-contact', upload.single('attachment'), async (req, res) => {
    // req.body contains text fields
    // req.file contains the uploaded file (if any)
    const { name, email, message, phone, newsletter } = req.body;
    
    console.log(`Received contact from: ${name}`);

    try {
        // 1. Save Text Data to Airtable
        // We add a note if a file was attached so you know to check email
        const fileNote = req.file ? "\n\n[File Attached in Email]" : "";
        
        await base(process.env.AIRTABLE_TABLE_NAME).create([
            {
                "fields": {
                    "Name": name,
                    "Email": email,
                    "Notes": message + fileNote, // Mapping 'message' to 'Notes'
                    "Phone": phone,
                    "Newsletter": newsletter === 'true', // FormData sends booleans as strings
                    
                }
            }
        ]);

        // 2. Prepare Email Options
        const mailOptions = {
            from: `"NC3D Website" <${process.env.SMTP_USER}>`,
            to: 'contact@nc3d.com', 
            replyTo: email,
            subject: `New Inquiry: ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nNotes:\n${message}\n\nNewsletter: ${newsletter === 'true' ? 'Yes' : 'No'}`,
            attachments: []
        };

        // 3. Attach File if exists
        if (req.file) {
            mailOptions.attachments.push({
                filename: req.file.originalname,
                content: req.file.buffer
            });
        }

        // 4. Send Email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Message sent!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// Catch-all
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});