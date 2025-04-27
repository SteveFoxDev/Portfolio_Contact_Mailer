if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// const corsOptions = {
//     origin: 'https://www.stevefox.dev',
//     // allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
//     // credentials: true,
//     // enablePreflight: true
// }

// app.use(cors(corsOptions));
// app.options('*', cors());
app.options('/your/endpoint', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.stevefox.dev'); // Replace with your allowed origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
  });
// app.use(cors());

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
    res.setHeader('Access-Control-Allow-Oigin', '*');
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