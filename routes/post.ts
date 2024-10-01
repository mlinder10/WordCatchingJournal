import { Router, Request } from "express";
import { turso } from "../storage/db";
import { Post } from "../types";
import { v4 } from "uuid";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit, offset } = getLimitAndOffset(req);
    // get Authorization as token
    const { Authorization: token } = req.headers;

    if (typeof token !== "string") {
      return res.status(401).json("Unauthorized");
    }

    const posts = await turso.execute({
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
         (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favoritesCount
        FROM posts p
        LEFT JOIN users u
        ON p.user_id = u.id
        LIMIT ? OFFSET ?
      `,
      args: [limit, offset],
    });

    return res.status(200).json(posts.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, offset } = getLimitAndOffset(req);

    const post = await turso.execute({
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
         (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favoritesCount
        FROM posts p
        LEFT JOIN users u
        ON p.user_id = u.id
        WHERE p.user_id = ?
        LIMIT ? OFFSET ?
      `,
      args: [userId, limit, offset],
    });
    return res.status(200).json(post.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/following/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, offset } = getLimitAndOffset(req);

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
         (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favoritesCount
        FROM posts p
        LEFT JOIN users u
        ON p.user_id = u.id
        WHERE p.user_id IN (SELECT user_id FROM following WHERE following_id = ?)
        LIMIT ? OFFSET ?
      `,
      args: [userId, limit, offset],
    });
    return res.status(200).json(rs.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { word, definition, partOfSpeech, userId } = req.body;
    const post: Post = {
      id: v4(),
      word,
      definition,
      partOfSpeech,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId,
    };

    await turso.execute({
      sql: "INSERT INTO posts (id, word, definition, part_of_speech, created_at, updated_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        post.id,
        post.word,
        post.definition,
        post.partOfSpeech,
        post.createdAt,
        post.updatedAt,
        post.userId,
      ],
    });
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { word, definition, partOfSpeech } = req.body;

    const rs = await turso.execute({
      sql: "SELECT * FROM posts WHERE id = ?",
      args: [id],
    });

    if (rs.rows.length === 0) {
      res.status(404).json("Post not found");
    }

    const post: Post = {
      id,
      word,
      definition,
      partOfSpeech,
      createdAt: rs.rows[0].created_at as number,
      updatedAt: Date.now(),
      userId: rs.rows[0].user_id as string,
    };

    await turso.execute({
      sql: "UPDATE posts SET word = ?, definition = ?, updated_at = ? WHERE id = ?",
      args: [post.word, post.definition, post.updatedAt, id],
    });

    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await turso.execute({
      sql: "DELETE FROM posts WHERE id = ?",
      args: [id],
    });
    return res.status(200).json("Post deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

export function getLimitAndOffset(req: Request): {
  limit: number;
  offset: number;
} {
  const { limit, offset } = req.query;

  let limitReturn = 10;
  let offsetReturn = 0;

  if (typeof limit === "string" && !isNaN(parseInt(limit))) {
    limitReturn = parseInt(limit);
  }

  if (typeof offset === "string" && !isNaN(parseInt(offset))) {
    offsetReturn = parseInt(offset);
  }

  return { limit: limitReturn, offset: offsetReturn };
}

export default router;
