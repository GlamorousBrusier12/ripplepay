"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
type p2pResponse = {
  isSuccess: boolean;
  message: string;
};
export async function createP2pTransfer(
  receiverNumber: string,
  amount: number,
): Promise<p2pResponse> {
  try {
    const session = await getServerSession(authOptions);

    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return {
        message: "something went wrong",
        isSuccess: false,
      };
    }
    console.log("current session user id", currentUserId);

    const receiverUser = await prisma.user.findFirst({
      where: {
        number: receiverNumber,
      },
    });

    console.log("receiver user id", receiverUser?.id);
    console.log(!receiverUser || currentUserId == receiverUser?.id);
    if (!receiverUser || currentUserId == receiverUser?.id) {
      throw new Error("sender not found");
    }

    console.log("control reached here");

    await prisma.$transaction(async (tsx) => {
      // locking the user row for balance table
      await tsx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(currentUserId)} FOR UPDATE;`;

      const sender = await tsx.balance.findFirst({
        where: { userId: Number(currentUserId) },
      });

      if (!sender || sender.amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tsx.balance.update({
        where: {
          userId: Number(currentUserId),
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      await tsx.balance.update({
        where: {
          userId: receiverUser.id,
        },
        data: {
          amount: {
            increment: amount,
          },
        },
      });
      console.log("transaction done!");
    });

    await prisma.p2pTransfer.create({
      data: {
        amount,
        timestamp: new Date(),
        toUserId: Number(receiverUser.id),
        fromUserId: Number(currentUserId),
      },
    });

    return {
      message: "transaction done",
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Insufficient amount in the user wallet or wrong sender number",
      isSuccess: false,
    };
  }
}
