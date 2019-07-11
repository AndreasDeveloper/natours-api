// Importing Dependencies
const nodemailer = require('nodemailer');

// Send email function
const sendEmail = async options => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        // - GMAIL AS A SERVICE
        // service: 'Gmail',
        // auth: {
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD
        // }
        // Activate in gmail 'less secure app' option

        // - MAILTRAP AS A SERVICE
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Define the email options object
    const mailOptions = {
        from: 'Andreas DEV <andreasmrdja16@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

// Exporting Function
module.exports = sendEmail;