import client from "@/config/db";
import { Post } from "@/config/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const rs = await client.execute({
      sql: "select * from posts",
      args: [],
    });
    return NextResponse.json(Post.fromRows(rs.rows), { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}