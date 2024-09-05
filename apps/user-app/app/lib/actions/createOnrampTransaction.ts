"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(
  provider: string,
  amount: number,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user?.id) {
    return {
      message: "un-authorized req",
    };
  }

  const token = (Math.random() * 1000).toString();

  const a = await prisma.onRampTransaction.create({
    data: {
      provider,
      status: "Processing",
      startTime: new Date(),
      token,
      userId: Number(session?.user?.id),
      amount: amount * 100,
    },
  });

  console.log("on ramped!!", provider, amount, a);
  return { message: "done!" };
}
