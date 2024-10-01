import { Router } from "express";
import { turso } from "../storage/db";
import { sendEmail } from "../utils";
import bcrypt from "bcrypt";

const router = Router();

// request password reset
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json("Email is required");
    }

    const rs = await turso.batch([
      {
        sql: "SELECT id from users WHERE email = ?",
        args: [email],
      },
      {
        sql: "INSERT INTO password_resets (user_id) VALUES ((SELECT id FROM users WHERE email = ?))",
        args: [email],
      },
    ]);

    if (rs[0].rows.length !== 1 || typeof rs[0].rows[0].id !== "string") {
      return res.status(404).json("Email not found");
    }

    try {
      await sendEmail(email, rs[0].rows[0].id);
    } catch (err) {
      console.log(err);
      return res.status(500).json("Failed to send password reset link");
    }

    return res.status(200).json("Password reset link sent");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// reset password
router.patch("/", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const rs = await turso.execute({
      sql: "SELECT id FROM password_resets WHERE user_id = ?",
      args: [userId],
    });

    if (rs.rows.length === 0) {
      return res.status(401).json("Not authorized to reset password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await turso.batch([
      {
        sql: "UPDATE users SET password = ? WHERE id = ?",
        args: [hashedPassword, userId],
      },
      {
        sql: "DELETE FROM password_resets WHERE user_id = ?",
        args: [userId],
      },
    ]);

    return res.status(200).json("Password reset successful");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
