import nodemailer from 'nodemailer'



// Forgot password
function generatePasswordResetTemplate(resetLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Write Code - Password Reset</title>
    </head>
    <body style="margin:0; padding:0; background-color:#1e1e2f; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e1e2f;">
        <tr>
          <td align="center">
            <table style="max-width: 600px; width: 100%; margin: 40px auto; background: #2a2a3d; border-radius: 12px; box-shadow: 0 0 15px rgba(0,0,0,0.3);" cellpadding="30">
              <tr>
                <td align="center" style="border-bottom: 1px solid #444; padding-bottom: 10px;">
                  <h2 style="color: #00C897; margin: 0;">🔑 Reset Your Password</h2>
                  <p style="color: #ccc; margin-top: 5px;">Write Code Account Recovery</p>
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; line-height: 1.6; padding-top: 20px;">
                  <p>Hello Developer,</p>
                  <p>We received a request to reset your password for your <strong>Write Code</strong> account.</p>
                  <p>Click the button below to reset your password:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #00C897; color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                      Reset Password
                    </a>
                  </div>
                  <p>This link will expire in <strong>24 hours</strong>. If you didn't request a password reset, please ignore this email.</p>
                  <p style="color: #ff6b6b;"><strong>Note:</strong> For security reasons, never share this link with anyone.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="border-top: 1px solid #444; padding-top: 20px; font-size: 14px; color: #999;">
                  <p>Thanks,<br><strong>The Write Code Team</strong></p>
                  <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
                  <p style="font-size: 12px; color: #555;">© ${new Date().getFullYear()} Write Code. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export const sendPasswordResetLink = async (resetLink, email) => {
    const subject = "Password Reset Request";
    const message = generatePasswordResetTemplate(resetLink);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const options = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        html: message,
    };

    await transporter.sendMail(options);
};






// send otp
function generateEmailTemplate(verificationCode) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Write Code - Email Verification</title>
    </head>
    <body style="margin:0; padding:0; background-color:#1e1e2f; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e1e2f;">
        <tr>
          <td align="center">
            <table style="max-width: 600px; width: 100%; margin: 40px auto; background: #2a2a3d; border-radius: 12px; box-shadow: 0 0 15px rgba(0,0,0,0.3);" cellpadding="30">
              <tr>
                <td align="center" style="border-bottom: 1px solid #444; padding-bottom: 10px;">
                  <h2 style="color: #00C897; margin: 0;">🔐 Verify Your Email</h2>
                  <p style="color: #ccc; margin-top: 5px;">Welcome to Write Code</p>
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; line-height: 1.6; padding-top: 20px;">
                  <p>Hello Developer,</p>
                  <p>Use the following verification code to complete your sign-up with <strong>Write Code</strong>:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 30px; font-weight: bold; color: #00C897; background-color: #1e2a26; padding: 16px 36px; border-radius: 8px; display: inline-block; border: 2px dashed #00C897;">
                      ${verificationCode}
                    </span>
                  </div>
                  <p>This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
                  <p>If you did not request this, you can safely ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="border-top: 1px solid #444; padding-top: 20px; font-size: 14px; color: #999;">
                  <p>Thanks,<br><strong>The Write Code Team</strong></p>
                  <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
                  <p style="font-size: 12px; color: #555;">© ${new Date().getFullYear()} Write Code. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export const sendEmailOTP = async (otp, email) => {
    const subject = "Your Verification Code"
    const message = generateEmailTemplate(otp);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const options = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        html: message,
    }

    await transporter.sendMail(options);
}
