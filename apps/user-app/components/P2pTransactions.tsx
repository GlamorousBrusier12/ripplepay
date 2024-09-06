import { Center } from "@repo/ui/center";

export const P2pTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    isReceiver: boolean;
    otherUserName: string;
  }[];
}) => {
  return (
    <Center>
      <div className="w-screen">
        {transactions.map((t) => (
          <div className="flex justify-between m-5">
            <div>
              <div className="text-sm">
                {t.isReceiver ? "Received from " : "Sent to "} {t.otherUserName}
              </div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div
              className={`flex flex-col text-[#${t.isReceiver ? "32CD32" : "DC143C"}] justify-center`}
            >
              + Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Center>
  );
};
