import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { createTables } from "../storage/db";
import authRouter from "../routes/auth";
import postRouter from "../routes/post";
import followRouter from "../routes/follow";
import userRouter from "../routes/user";
import searchRouter from "../routes/search";
import likesRouter from "../routes/like";
import favoritesRouter from "../routes/favorite";
import { authMiddleware } from "../utils";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

const PORT = process.env.PORT || 3000;

const api = express.Router();
app.use("/api", api);
api.use("/auth", authRouter);

const protectedApi = express.Router();
protectedApi.use(authMiddleware);
api.use("/", protectedApi);
protectedApi.use("/posts", postRouter);
protectedApi.use("/follow", followRouter);
protectedApi.use("/users", userRouter);
protectedApi.use("/search", searchRouter);
protectedApi.use("/like", likesRouter);
protectedApi.use("/favorite", favoritesRouter);

// app.get("*", (_, res) =>
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
// );

app.listen(PORT, async () => {
  // await dropTables();
  await createTables();
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
