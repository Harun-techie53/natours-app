const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    //Create email options
    const mailOptions = {
        from: 'Harunur Rashid <harunurrashid861@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    //Send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;