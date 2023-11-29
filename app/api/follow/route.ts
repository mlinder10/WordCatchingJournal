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
      args: [user.followers as any],
    });
    const followingRs = await client.execute({
      sql: "select * from users where uid in (?)",
      args: [user.following as any],
    });
    const followers = User.fromRows(followersRs.rows);
    const following = User.fromRows(followingRs.rows);
    return NextResponse.json({ followers, following }, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { user, pageUser } = body;
  if (!user || !pageUser) {
    return NextResponse.json(
      { message: "Missing user or pageUser" },
      { status: 400 }
    );
  }
  try {
    if (user.following.includes(pageUser.uid)) {
      await client.execute({
        sql: "update users set following = array_remove(following, ?) where uid = ?",
        args: [pageUser.uid, user.uid],
      });
      user.following.filter((uid: string) => uid !== pageUser.uid);
      await client.execute({
        sql: "update users set followers = array_remove(followers, ?) where uid = ?",
        args: [user.uid, pageUser.uid],
      });
      pageUser.followers.filter((uid: string) => uid !== user.uid);
    } else {
      await client.execute({
        sql: "update users set following = array_append(following, ?) where uid = ?",
        args: [pageUser.uid, user.uid],
      });
      user.following.push(pageUser.uid);
      await client.execute({
        sql: "update users set followers = array_append(followers, ?) where uid = ?",
        args: [user.uid, pageUser.uid],
      });
      pageUser.followers.push(user.uid);
    }
    return NextResponse.json({ user, pageUser }, { status: 202 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
