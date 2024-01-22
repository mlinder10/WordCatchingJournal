import { NextRequest, NextResponse } from "next/server";
import client from "@/config/db";
import { randomUUID } from "crypto";
import { User } from "@/config/types";

export async function GET(request: NextRequest) {
  const email = request.headers.get("email");
  const password = request.headers.get("password");
  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing email or password" },
      { status: 400 }
    );
  }
  try {
    const rs = await client.execute({
      sql: "select * from users where email = ? and password = ?",
      args: [email, password],
    });
    return NextResponse.json(User.fromRow(rs.rows[0]), { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, username, password } = body;
  if (!email || !username || !password) {
    return NextResponse.json(
      { message: "Missing email, username or password" },
      { status: 400 }
    );
  }
  try {
    const existing = await client.execute({
      sql: "select * from users where email = ?",
      args: [email],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }
    await client.execute({
      sql: "insert into users (uid, email, username, password, followers, following, profileImageUrl) values (?, ?, ?, ?, ?, ?, ?)",
      args: [randomUUID(), email, username, password, "[]", "[]", ""],
    });
    const rs = await client.execute({
      sql: "select * from users where email = ?",
      args: [email],
    });
    return NextResponse.json(User.fromRow(rs.rows[0]), { status: 201 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}

async function DELETE(request: NextRequest) {
  try {
    const uid = request.headers.get("uid");
    if (!uid) {
      return NextResponse.json({ message: "Missing uid" }, { status: 400 });
    }
    await client.execute({
      sql: "delete from users where uid = ?",
      args: [uid],
    });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}