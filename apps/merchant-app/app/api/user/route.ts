import db from "@repo/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users = await db.user.findMany({});

  return NextResponse.json({
    message: "hello!",
    users: users,
  });
};
