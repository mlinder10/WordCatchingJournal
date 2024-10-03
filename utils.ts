import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import { turso } from "./storage/db";

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

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization: token } = req.headers;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (typeof token !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const rs = await turso.execute({
    sql: "SELECT id FROM users WHERE token = ?",
    args: [token],
  });
  if (rs.rows.length === 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.body = { ...req.body, userId: rs.rows[0].id, token };
  next();
}
