import { Router } from "express";
import { turso } from "../storage/db";
import { getLimitAndOffset } from "./post";

const router = Router();

router.get("/users/:postId", async (req, res) => {
  try {
    const { limit, offset } = getLimitAndOffset(req);
    const { postId } = req.params;
    const rs = await turso.execute({
      sql: `
        SELECT
          u.id,
          u.username,
          u.profile_pic as profilePic
        FROM likes l
        LEFT JOIN users u
        ON l.user_id = u.id
        WHERE l.post_id = ?
        LIMIT ? OFFSET ?
      `,
      args: [postId, limit, offset],
    });
    return res.status(200).json(rs.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/posts/:userId", async (req, res) => {
  try {
    const { limit, offset } = getLimitAndOffset(req);
    const { userId } = req.params;
    const { token } = req.body;
    const rs = await turso.execute({
      sql: `
        SELECT
          p.id,
          p.word,
          p.definition,
          p.part_of_speech as partOfSpeech,
          p.created_at as createdAt,
          p.updated_at as updatedAt,
          p.user_id as userId,
          u.username,
          u.profile_pic as profilePic,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likesCount,
          (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favoritesCount,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = (SELECT id FROM users WHERE token = ?)) as liked,
          (SELECT COUNT(*) FROM favorites WHERE post_id = p.id AND user_id = (SELECT id FROM users WHERE token = ?)) as favorited
        FROM likes l
        LEFT JOIN posts p
        ON l.post_id = p.id
        LEFT JOIN users u
        ON p.user_id = u.id
        WHERE l.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [token, token, userId, limit, offset],
    });
    return res.status(200).json(rs.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await turso.execute({
      sql: "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
      args: [userId, postId],
    });
    return res.status(200).json({ liked: 1 });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await turso.execute({
      sql: "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
      args: [userId, postId],
    });
    return res.status(200).json({ liked: 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

export default router;
