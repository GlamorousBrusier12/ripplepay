import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users: (typeof prisma.user)[] = [];

  return NextResponse.json({
    message: "hello!",
    users: users,
  });
};
