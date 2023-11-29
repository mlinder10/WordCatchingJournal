import client from "@/config/db";
import { User } from "@/config/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uid = request.headers.get("uid");
  if (!uid) {
    return NextResponse.json({ message: "Missing uid" }, { status: 400 });
  }
  try {
    const rs = await client.execute({
      sql: "select * from users where uid = ?",
      args: [uid],
    });
    if (rs.rows.length !== 1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = User.fromRow(rs.rows[0]);
    const followersRs = await client.execute({
      sql: "select * from users where uid in (?)",
      args: user.followers,
    });
    const followingRs = await client.execute({
      sql: "select * from users where uid in (?)",
      args: user.following,
    });
    const followers = User.fromRows(followersRs.rows);
    const following = User.fromRows(followingRs.rows);
    return NextResponse.json({ followers, following }, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
