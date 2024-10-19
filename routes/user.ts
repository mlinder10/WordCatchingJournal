import { Router } from "express";
import { Post } from "../types";
import { turso } from "../storage/db";

const router = Router();

type UserResponse = {
  user: {
    id: string;
    username: string;
    profilePic: string;
    followers: number;
    following: number;
    posts: number;
  };
  posts: Post[];
  isFollowing: boolean;
};

router.get("/:userId/:localUserId", async (req, res) => {
  try {
    const { userId, localUserId } = req.params;

    const rs = await turso.batch([
      {
        sql: `
          SELECT
            u.id,
            u.username,
            u.profile_pic as profilePic
          FROM users u
          WHERE u.id = ?
        `,
        args: [userId],
      },
      {
        sql: `
          SELECT COUNT(*) AS count FROM following WHERE following_id = ?
        `,
        args: [userId],
      },
      {
        sql: `
          SELECT COUNT(*) AS count FROM following WHERE user_id = ?
        `,
        args: [userId],
      },
      {
        sql: `
          SELECT COUNT(*) AS count FROM posts WHERE user_id = ?
        `,
        args: [userId],
      },
      {
        sql: `
          SELECT COUNT(*) AS count FROM following WHERE user_id = ? AND following_id = ?
        `,
        args: [userId, localUserId],
      },
      {
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
          WHERE p.user_id = ?
          ORDER BY p.created_at DESC
          LIMIT 10
        `,
        args: [localUserId, localUserId, userId],
      },
    ]);

    if (rs[0].rows.length === 0) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json({
      user: {
        ...rs[0].rows[0],
        following: rs[1].rows[0].count,
        followers: rs[2].rows[0].count,
        posts: rs[3].rows[0].count,
      },
      isFollowing: ((rs[4].rows[0].count as number) ?? 0) > 0,
      posts: rs[5].rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.patch("/:userId", async (req, res) => {
  try {
    const { username, profilePic } = req.body;

    const rs = await turso.execute({
      sql: "UPDATE users SET username = ?, profile_pic = ? WHERE id = ?",
      args: [username, profilePic, req.params.userId],
    });

    return res.status(200).json("Success");
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

export default router;
