import { Router } from "express";
import { turso } from "../storage/db";
import { getLimitAndOffset } from "./post";

const router = Router();

router.get("/following/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, offset } = getLimitAndOffset(req);

    const following = await turso.execute({
      sql: `
        SELECT
          u.id, u.username, u.profile_pic as profilePic
        FROM following f
        LEFT JOIN users u
        ON f.user_id = u.id
        WHERE f.following_id = ?
        LIMIT ? OFFSET ?
      `,
      args: [userId, limit, offset],
    });

    return res.status(200).json(following.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/followers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, offset } = getLimitAndOffset(req);

    const rs = await turso.execute({
      sql: `
        SELECT 
          u.id,
          u.username,
          u.profile_pic AS profilePic,
          COUNT(DISTINCT p.id) AS postsCount,
          COUNT(DISTINCT f2.user_id) AS followingCount,
          COUNT(DISTINCT f3.following_id) AS followersCount
        FROM following f1
        JOIN users u ON f1.following_id = u.id
        LEFT JOIN posts p ON u.id = p.user_id
        LEFT JOIN following f2 ON u.id = f2.following_id
        LEFT JOIN following f3 ON u.id = f3.user_id
        WHERE f1.user_id = ?
        GROUP BY u.id, u.username
        LIMIT ? OFFSET ?
      `,
      args: [userId, limit, offset],
    });

    return res.status(200).json(rs.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, followedUserId } = req.body;
    await turso.execute({
      sql: "INSERT INTO following (user_id, following_id) VALUES (?, ?)",
      args: [followedUserId, userId],
    });
    return res.status(200).json("Success");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { userId, followedUserId } = req.body;
    await turso.execute({
      sql: "DELETE FROM following WHERE user_id = ? AND following_id = ?",
      args: [followedUserId, userId],
    });
    return res.status(200).json("Success");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
