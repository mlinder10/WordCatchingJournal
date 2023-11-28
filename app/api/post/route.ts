import client from "@/config/db";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { word, definition, user } = body;
  if (!word || !definition || !user) {
    return NextResponse.json(
      { message: "Missing word or definition or user" },
      { status: 400 }
    );
  }
  try {
    const pid = randomUUID();
    await client.execute({
      sql: "insert into posts (pid, uid, word, definition, createdAt, profileImageUrl, email, username, likes) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        pid,
        user.uid,
        word,
        definition,
        new Date().toISOString(),
        user.profileImageUrl,
        user.email,
        user.username,
        "[]",
      ],
    });
    const rs = await client.execute({
      sql: "select * from posts where pid = ?",
      args: [pid],
    });
    return NextResponse.json(rs.rows[0], { status: 201 });
  } catch (err: any) {
    console.error(err?.message);
  }
}
