import { Router } from "express";
import { turso } from "../storage/db";
import { getLimitAndOffset } from "./post";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { search, filter } = req.body;
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
      values = [...values, ...users.rows.map((u) => ({ ...u, type: "user" }))];
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
            u.profile_pic as profilePic
          FROM posts p
          LEFT JOIN users u
          ON p.user_id = u.id
          WHERE p.word LIKE ?
          LIMIT ? OFFSET ?
      `,
        args: [`%${search}%`, limit, offset],
      });

      values = [
        ...values,
        ...postsByWord.rows.map((p) => ({ ...p, type: "post" })),
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
            u.profile_pic as profilePic
          FROM posts p
          LEFT JOIN users u
          ON p.user_id = u.id
          WHERE p.definition LIKE ?
          LIMIT ? OFFSET ?
      `,
        args: [`%${search}%`, limit, offset],
      });

      values = [
        ...values,
        ...postsByDefinition.rows.map((p) => ({ ...p, type: "post" })),
      ];
    }

    return res.status(200).json(values);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

export default router;
