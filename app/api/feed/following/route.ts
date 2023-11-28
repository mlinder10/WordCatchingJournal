import client from "@/config/db";
import { Post } from "@/config/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const following = request.nextUrl.searchParams.get("following");
    if (typeof following !== "string")
      return NextResponse.json(
        { message: "Missing following" },
        { status: 400 }
      );
    const followingArray = JSON.parse(following);
    const rs = await client.execute({
      sql: "select * from posts where uid in (?)",
      args: [followingArray],
    });
    return NextResponse.json(Post.fromRows(rs.rows), { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
