import "dotenv/config"
import nodemailer from "nodemailer"
export const sendOTPMail = (otp, email) => {
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
        subject: "Ekart | Password Reset OTP",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
                
                <h2 style="color: #222; text-align: center;">Ekart Password Reset</h2>
                
                <p style="color: #555; font-size: 14px;">
                    Hi,<br/><br/>
                    You requested to reset your Ekart account password.
                    Please use the OTP below to proceed.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <span style="
                        font-size: 28px;
                        letter-spacing: 6px;
                        font-weight: bold;
                        color: #ffffff;
                        background: #ff6b35;
                        padding: 12px 22px;
                        border-radius: 6px;
                        display: inline-block;
                    ">
                        ${otp}
                    </span>
                </div>

                <p style="color: #555; font-size: 14px;">
                    This OTP is valid for <strong>10 minutes</strong>.  
                    Please do not share this OTP with anyone for security reasons.
                </p>

                <hr style="margin: 25px 0;" />

                <p style="font-size: 12px; color: #888; text-align: center;">
                    If you did not request a password reset, please ignore this email.
                    <br/><br/>
                    © ${new Date().getFullYear()} Ekart. All rights reserved.
                </p>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailConfiguration, (error, info) => {
        if (error) {
            console.error("Email sending failed:", error);
            throw new Error(error);
        }
        console.log("OTP Email sent successfully!");
        console.log(info.response);
    });
};

