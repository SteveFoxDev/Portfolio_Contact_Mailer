if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.options('*', cors());
app.use(cors());

app.use(express.urlencoded({ extended: true })); // Parse Body Data
app.use(express.json()); // Parse incoming JSON body data

//Mailer config
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/send-email', async (req, res, next) => {
    const { fullname, email, newMessage } = req.body;
    const message = {fullname, email, newMessage}
    
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: 'Message from website',
            text: JSON.stringify(message) || 'This is a test email.'
        };

        await transporter.sendMail(mailOptions);
        res.json('Email Sent');
    } catch (error) {
        res.json('Error');
    }
});

// SERVER SETUP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port 3000');
})