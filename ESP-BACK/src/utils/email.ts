import dotenv from 'dotenv'
import nodemailer from 'nodemailer'


dotenv.config()


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendEmail = async (to: string | string[], subject: string, text: string) => {
    try {
      const recipients = Array.isArray(to) ? to.join(",") : to; // Convert array to comma-separated string
  
      await transporter.sendMail({
        from: `"Noise Monitor" <${process.env.EMAIL_USER}>`, // Ensure sender email is correct
        to: recipients,
        subject,
        text,
      });
  
      console.log(`📧 Email sent to: ${recipients}`);
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  };
