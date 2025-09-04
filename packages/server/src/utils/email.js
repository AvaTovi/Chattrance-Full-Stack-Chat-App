import dotenv from "dotenv";
import nodeMailer from "nodemailer";

import { FRONTEND_ROUTES } from "chattrance-shared";

dotenv.config();

async function sendEmail(option) {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.EMAIL_ID,
    to: option.email,
    subject: option.subject,
    html: option.message,
  };
  await transporter.sendMail(mailOption);
}

/**
 * 
 * @param {string} content 
 * @param {string} buttonURL 
 * @param {string} buttonText 
 * @returns {string}
 */
function mailTemplate(content, buttonURL, buttonText) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="text-align: center; font-family: sans-serif; color: #000;">
    <div
      style="
        max-width: 400px;
        margin: 10px;
        background-color: #fafafa;
        padding: 25px;
        border-radius: 20px;
      "
    >
      <p style="text-align: left;">
        ${content}
      </p>
      <a href="${buttonURL}" target="_blank">
        <button
          style="
            background-color: #0c2d96ff;
            border: 0;
            width: 200px;
            height: 30px;
            border-radius: 6px;
            color: #fff;
          "
        >
          ${buttonText}
        </button>
      </a>
      <p style="text-align: left;">
        If you are unable to click the above button, copy paste the below URL into your address bar
      </p>
      <a href="${buttonURL}" target="_blank">
          <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
            ${buttonURL}
          </p>
      </a>
    </div>
  </body>
  </html>`;
}

/**
 * 
 * @param {number} id
 * @param {string} email 
 * @param {string} plainToken
 * @returns {}
 */
export async function sendPasswordResetEmail(id, email, plainToken) {

  const baseLink = process.env.FRONTEND_URL + FRONTEND_ROUTES.AUTH.RESET_PASSWORD;

  const body = mailTemplate(
    "We have received a request to reset your password. Please reset your password using the link below.",
    `${baseLink}?id=${id}&token=${plainToken}`,
    "Reset Password"
  );

  const mailOptions = {
    email,
    subject: "Chattrance: Password Reset Link",
    message: body
  }

  await sendEmail(mailOptions);
}
