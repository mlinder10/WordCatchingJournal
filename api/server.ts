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

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

const PORT = process.env.PORT || 3000;

const api = express.Router();
app.use("/api", api);

api.use("/auth", authRouter);
api.use("/posts", postRouter);
api.use("/follow", followRouter);
api.use("/users", userRouter);
api.use("/search", searchRouter);

app.listen(PORT, async () => {
  // await dropTables();
  await createTables();
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
