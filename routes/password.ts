import { Router } from "express";
import { turso } from "../storage/db";

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
        sql: "INSERT INTO password_resets (user_id) VALUES (SELECT id FROM users WHERE email = ?)",
        args: [email],
      },
    ]);

    if (rs[0].rows.length !== 1) {
      return res.status(404).json("Email not found");
    }

    const link = `reset-password/${rs[0].rows[0].id}`;
    console.log(link);
    // TODO: send email with link

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

    await turso.execute({
      sql: "UPDATE users SET password = ? WHERE id = ?",
      args: [newPassword, userId],
    });

    return res.status(200).json("Password reset successful");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
