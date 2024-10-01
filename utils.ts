import nodemailer from "nodemailer";

// TODO: use a different email provider
export async function sendEmail(email: string, userId: string) {
  const user = process.env.EMAIL_ADDR;
  const pass = process.env.EMAIL_PASS;

  let transporter = nodemailer.createTransport({
    service: "outlook.com",
    auth: {
      user,
      pass,
    },
  });

  let mailOptions = {
    from: `"Word Catching Journal" <${user}>`,
    to: email,
    subject: "Password Reset",
    html: `
    <div>
      <p>Please click the following link to reset your password:</p>
      <a href="http://localhost:3000/auth/reset-password/${userId}">Reset Password</a>
    </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
