import client from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export function DELETE(request: NextRequest) {
  const pid = request.nextUrl.searchParams.get("pid");
  if (!pid) {
    return NextResponse.json({ message: "Missing pid" }, { status: 400 });
  }
  try {
    client.execute({
      sql: "delete from posts where pid = ?",
      args: [pid],
    });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
