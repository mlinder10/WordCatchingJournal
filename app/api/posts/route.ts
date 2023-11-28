import client from "@/config/db";
import { Post } from "@/config/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ message: "Missing uid" }, { status: 400 });
  }
  try {
    const rs = await client.execute({
      sql: "select * from posts where uid = ? order by createdAt desc",
      args: [uid],
    });
    return NextResponse.json(Post.fromRows(rs.rows), { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
