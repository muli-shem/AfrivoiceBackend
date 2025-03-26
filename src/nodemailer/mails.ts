import nodemailer from "nodemailer";
import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

/**
 * Sends an email using Nodemailer and logs the result using Winston.
 * @param from - Sender's email address.
 * @param to - Recipient's email address.
 * @param subject - Email subject.
 * @param html - HTML content of the email.
 */
export const sendMail = async (from: string, to: string, subject: string, html: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Use Gmail service
            auth: {
                user: process.env.MAIL_USERNAME, // Email username
                pass: process.env.MAIL_PASSWORD, // App-specific password
            },
        });

        const mailOptions = {
            from, // Sender address
            to, // Recipient address
            subject, // Subject line
            html, // HTML body content
        };

        logger.info(`Sending email to ${to}...`);

        // Sending email using async/await
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully: ${info.response}`);
    } catch (error:any) {
        logger.error(`Failed to send email: ${error.message}`);
        throw new Error("Email sending failed. Please try again.");
    }
};
