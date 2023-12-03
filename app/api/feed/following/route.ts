import client from "@/config/db";
import { Post, User } from "@/config/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const uid = request.headers.get("uid");
  if (!uid) {
    return NextResponse.json({ message: "Missing uid" }, { status: 400 });
  }
  try {
    const userRs = await client.execute({
      sql: "select * from users where uid = ?",
      args: [uid],
    });
    if (userRs.rows.length !== 1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = User.fromRow(userRs.rows[0]);
    const postsRs = await client.execute({
      sql: "select * from posts where uid in (?) order by createdAt desc",
      args: [user.following as any],
    });
    return NextResponse.json(Post.fromRows(postsRs.rows) , { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
