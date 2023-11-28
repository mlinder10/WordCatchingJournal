import client from "@/config/db";
import { Post, User } from "@/config/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  if (!search) {
    return NextResponse.json({ message: "Missing search" }, { status: 400 });
  }
  try {
    const postRs = await client.execute({
      sql: "select * from posts where word like ? or definition like ? order by createdAt desc",
      args: [`%${search}%`, `%${search}%`],
    });
    const userRs = await client.execute({
      sql: "select * from users where username like ? or email like ?",
      args: [`%${search}%`, `%${search}%`],
    });
    const rs = {
      posts: Post.fromRows(postRs.rows),
      users: User.fromRows(userRs.rows),
    };
    return NextResponse.json(rs, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
