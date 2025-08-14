require('dotenv').config();

const nodeMailer = require('nodemailer');

const sendEmail = async (option) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOption = {
            from: process.env.EMAIL_ID,
            to: option.email,
            subject: option.subject,
            html: option.message
        };
        const info = await transporter.sendMail(mailOption);
        console.log(info.response);
    } catch (err) {
        console.log(err);
    }
};

const mailTemplate = (content, buttonURL, buttonText) => {
    return `
    <>
    <>
    <>
    `;
};

module.exports = { sendEmail, mailTemplate };