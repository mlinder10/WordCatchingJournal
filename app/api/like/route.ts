import client from "@/config/db";
import { Post } from "@/config/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { pid, uid } = body;
  if (!pid || !uid) {
    return NextResponse.json(
      { message: "Missing pid or uid" },
      { status: 400 }
    );
  }
  try {
    const rs = await client.execute({
      sql: "select * from posts where pid = ?",
      args: [pid],
    });
    if (rs.rows.length !== 1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const post = Post.fromRow(rs.rows[0]);
    if (post.likes.includes(uid)) {
      post.likes.splice(post.likes.indexOf(uid), 1);
    } else {
      post.likes.push(uid);
    }
    await client.execute({
      sql: "update posts set likes = ? where pid = ?",
      args: [JSON.stringify(post.likes), pid],
    });
    const postRs = await client.execute({
      sql: "select * from posts where pid = ?",
      args: [pid],
    });
    return NextResponse.json(Post.fromRow(postRs.rows[0]), { status: 202 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
