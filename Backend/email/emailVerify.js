import "dotenv/config"
import nodemailer from "nodemailer"
export const verifyEmail = (token, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfiguration = {
        from: `"Ekart" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Ekart | Email Verification",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
                
                <h2 style="color: #222; text-align: center;">Verify Your Email</h2>
                
                <p style="color: #555; font-size: 14px;">
                    Hi,<br/><br/>
                    Thank you for signing up with <strong>Ekart</strong>.
                    Please verify your email address by clicking the button below.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/verify/${token}"
                       style="
                        background-color: #ff6b35;
                        color: #ffffff;
                        padding: 12px 24px;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 6px;
                        display: inline-block;
                        font-weight: bold;
                       ">
                        Verify Email
                    </a>
                </div>

                <p style="color: #555; font-size: 14px;">
                    If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break: break-all; font-size: 13px; color: #2c7be5;">
                    http://localhost:5173/verify/${token}
                </p>

                <hr style="margin: 25px 0;" />

                <p style="font-size: 12px; color: #888; text-align: center;">
                    If you did not create an Ekart account, you can safely ignore this email.
                    <br/><br/>
                    © ${new Date().getFullYear()} Ekart. All rights reserved.
                </p>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailConfiguration, (error, info) => {
        if (error) {
            console.error("Email verification failed:", error);
            throw new Error(error);
        }
        console.log("Verification email sent successfully!");
        console.log(info.response);
    });
};
 

