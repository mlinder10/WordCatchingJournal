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
    return NextResponse.json(User.fromRow(rs.rows[0]), { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user } = await request.json();
  if (!user) {
    return NextResponse.json({ message: "Missing user" }, { status: 400 });
  }
  try {
    await client.execute({
      sql: "update users set username = ?, password = ?, profileImageUrl = ? where uid = ?",
      args: [user.username, user.password, user.profileImageUrl, user.uid],
    });
    await client.execute({
      sql: "update posts set username = ?, profileImageUrl = ? where uid = ?",
      args: [user.username, user.profileImageUrl, user.uid],
    });
    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
