import { Router } from "express";
import { turso } from "../storage/db";
import { getLimitAndOffset } from "./post";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { search, filter } = req.body;
    const { userId } = req.body;
    const { limit, offset } = getLimitAndOffset(req);

    if (!search || !filter) {
      return res.status(400).json("Search and filter are required");
    }

    let values: any[] = [];

    if (filter.includes("users") || filter.length === 0) {
      const users = await turso.execute({
        sql: `
          SELECT
            id,
            username,
            profile_pic AS profilePic
          FROM users
          WHERE username LIKE ?
          LIMIT ? OFFSET ?
        `,
        args: [`%${search}%`, limit, offset],
      });
      values = [
        ...values,
        ...users.rows.map((user) => ({ ...user, type: "user" })),
      ];
    }

    if (filter.includes("words") || filter.length === 0) {
      const postsByWord = await turso.execute({
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
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as liked,
            (SELECT COUNT(*) FROM favorites WHERE post_id = p.id AND user_id = ?) as favorited
          FROM posts p
          LEFT JOIN users u
          ON p.user_id = u.id
          WHERE p.word LIKE ?
          LIMIT ? OFFSET ?
      `,
        args: [userId, userId, `%${search}%`, limit, offset],
      });

      values = [
        ...values,
        ...postsByWord.rows.map((post) => ({ ...post, type: "post" })),
      ];
    }

    if (filter.includes("definitions") || filter.length === 0) {
      const postsByDefinition = await turso.execute({
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
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as liked,
            (SELECT COUNT(*) FROM favorites WHERE post_id = p.id AND user_id = ?) as favorited
          FROM posts p
          LEFT JOIN users u
          ON p.user_id = u.id
          WHERE p.definition LIKE ?
          LIMIT ? OFFSET ?
      `,
        args: [userId, userId, `%${search}%`, limit, offset],
      });

      values = [
        ...values,
        ...postsByDefinition.rows.map((post) => ({ ...post, type: "post" })),
      ];
    }

    // filter out items with identical ids
    values = values.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );

    return res.status(200).json(values);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

export default router;
