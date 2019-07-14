// Importing Dependencies
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');


// Email Class
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours <${process.env.EMAIL_FROM}>`;
    }

    // Creating Transport Method
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        } 

        // Nodemailer Mailtrap in dev environment
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    };

    // Factory Send Method for sending emails
    async send(template, subject) {
        // Render markup for the email based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    };

    // Send Welcome Email to new user
    async sendWelcome() {
        await this.send('welcome', 'Welcome to Natours!');
    };

    // Send password reset email with reset link
    async sendPasswordReset() {
        await this.send('passwordReset', 'Reset your password');
    };
};




// // Send email function
// const sendEmail = async options => {
//     // Create a transporter
//     // const transporter = nodemailer.createTransport({
//         // - GMAIL AS A SERVICE
//         // service: 'Gmail',
//         // auth: {
//         //     user: process.env.EMAIL_USERNAME,
//         //     pass: process.env.EMAIL_PASSWORD
//         // }
//         // Activate in gmail 'less secure app' option
// };