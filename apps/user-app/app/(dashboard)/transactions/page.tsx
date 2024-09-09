import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { P2pTransactions } from "../../../components/P2pTransactions";

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);

  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {
          toUserId: Number(session?.user?.id),
        },
        {
          fromUserId: Number(session?.user?.id),
        },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
    include: {
      toUser: true,
      fromUser: true,
    },
  });

  return transactions.map((txn: (typeof transactions)[0]) => {
    return {
      time: txn.timestamp,
      amount: txn.amount,
      isReceiver: txn.toUserId == session?.user?.id,
      otherUserName:
        txn.toUserId == session?.user?.id
          ? txn.toUser.number
          : txn.fromUser.number,
    };
  });
}

export default async function () {
  const transactions = await getP2pTransactions();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        My Transactions
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <div className="pt-4">
            <P2pTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
