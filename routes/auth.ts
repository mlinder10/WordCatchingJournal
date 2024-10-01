import { Router } from "express";
import { User } from "../types";
import { v4 } from "uuid";
import { turso } from "../storage/db";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("All fields are required");
    }

    const users = await turso.execute({
      sql: `
        SELECT
          id,
          username,
          token,
          profile_pic AS profilePic,
          password
        FROM users
        WHERE email = ?`,
      args: [email],
    });

    if (users.rows.length === 0 || typeof users.rows[0].password !== "string") {
      return res.status(401).json("Invalid credentials");
    }

    const match = await bcrypt.compare(password, users.rows[0].password);
    if (!match) {
      return res.status(401).json("Invalid credentials");
    }

    const token = v4();

    await turso.execute({
      sql: "UPDATE users SET token = ? WHERE id = ?",
      args: [token, users.rows[0].id],
    });

    return res.status(200).json({
      id: users.rows[0].id,
      username: users.rows[0].username,
      token: token,
      profilePic: users.rows[0].profilePic,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal server error");
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json("All fields are required");
    }

    const existing = await turso.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return res.status(400).json("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = {
      id: v4(),
      email,
      username,
      password: hashedPassword,
      token: v4(),
      profilePic: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await turso.execute({
      sql: `
      INSERT INTO users
        (id, username, email, password, token, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        user.id,
        user.username,
        user.email,
        user.password,
        user.token,
        user.createdAt,
        user.updatedAt,
      ],
    });

    return res.status(201).json({
      id: user.id,
      token: user.token,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await turso.execute({
      sql: `
        SELECT
          id,
          token,
          username,
          profile_pic AS profilePic
        FROM users
        WHERE token = ?`,
      args: [token],
    });

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid token");
    }

    return res.status(200).json({
      id: user.rows[0].id,
      username: user.rows[0].username,
      profilePic: user.rows[0].profilePic,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/logout/:token", async (req, res) => {
  try {
    const { token } = req.params;
    await turso.execute({
      sql: "UPDATE users SET token = NULL WHERE token = ?",
      args: [token],
    });
    return res.status(200).json("Logged out successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
