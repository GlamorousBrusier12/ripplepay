import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (session?.user) {
    return NextResponse.json({
      message: "you are logged in!",
      user: session.user,
    });
  }
  return NextResponse.json(
    {
      message: "hello! please login",
    },
    { status: 403 },
  );
};
